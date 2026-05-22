import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { chromium, Browser } from 'playwright';

interface Source {
    id: number;
    url: string;
    title: string;
    notes: string[];
    _status?: string;
}

interface DownloadCounts {
    downloaded: number;
    skippedExisting: number;
    skippedBadStatus: number;
    failed: number;
}

const root = resolve(__dirname, '..');
const sourcesJsonPath = resolve(root, 'lib/data/json/sources.json');
const outputDir = resolve(root, 'lib/data/sources');

const DOMAIN_DELAY_MILLISECONDS = 2000;
const PAGE_LOAD_TIMEOUT_MILLISECONDS = 30000;

const FILESYSTEM_FORBIDDEN_CHARACTERS = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'];

const stripForbiddenFilesystemCharacters = (title: string): string =>
    FILESYSTEM_FORBIDDEN_CHARACTERS.reduce(
        (accumulated, character) => accumulated.split(character).join(''),
        title,
    );

// \s+ matches any run of whitespace characters — no standard string method covers multi-char whitespace runs
const collapseWhitespace = (text: string): string =>
    text.split(/\s+/).join(' ');

const sanitizeTitle = (title: string): string =>
    collapseWhitespace(stripForbiddenFilesystemCharacters(title)).trim();

const outputPath = (source: Source): string =>
    resolve(outputDir, `${source.id} - ${sanitizeTitle(source.title)}.txt`);

const extractHostname = (url: string): string => {
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
};

const waitForDomainCooldown = async (
    hostname: string,
    lastFetchedAt: Map<string, number>,
): Promise<void> => {
    const lastFetchTimestamp = lastFetchedAt.get(hostname);
    if (lastFetchTimestamp === undefined) {
        return;
    }
    const elapsed = Date.now() - lastFetchTimestamp;
    if (elapsed < DOMAIN_DELAY_MILLISECONDS) {
        await new Promise<void>(wake => setTimeout(wake, DOMAIN_DELAY_MILLISECONDS - elapsed));
    }
};

const downloadSource = async (
    source: Source,
    browser: Browser,
    lastFetchedAt: Map<string, number>,
): Promise<void> => {
    const hostname = extractHostname(source.url);
    await waitForDomainCooldown(hostname, lastFetchedAt);

    const page = await browser.newPage();
    await page.goto(source.url, { waitUntil: 'networkidle', timeout: PAGE_LOAD_TIMEOUT_MILLISECONDS });
    const bodyText = await page.innerText('body');
    writeFileSync(outputPath(source), bodyText, 'utf8');
    await page.close();

    lastFetchedAt.set(hostname, Date.now());
    console.log(`DOWNLOADED: ${source.id} - ${source.title}`);
};

const processSources = async (
    sources: Source[],
    browser: Browser,
): Promise<DownloadCounts> => {
    const counts: DownloadCounts = {
        downloaded: 0,
        skippedExisting: 0,
        skippedBadStatus: 0,
        failed: 0,
    };
    const lastFetchedAt = new Map<string, number>();

    for (const source of sources) {
        if (existsSync(outputPath(source))) {
            counts.skippedExisting++;
            continue;
        }

        if (source._status) {
            console.log(`SKIPPED (${source._status}): ${source.id} - ${source.title}`);
            counts.skippedBadStatus++;
            continue;
        }

        try {
            await downloadSource(source, browser, lastFetchedAt);
            counts.downloaded++;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(`FAILED: ${source.id} - ${source.title} — ${message}`);
            counts.failed++;
        }
    }

    return counts;
};

const main = async (): Promise<void> => {
    const sources: Source[] = JSON.parse(readFileSync(sourcesJsonPath, 'utf8'));

    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    const browser = await chromium.launch();
    const counts = await processSources(sources, browser);
    await browser.close();

    console.log(
        `\nDone. Downloaded: ${counts.downloaded}, Skipped (existing): ${counts.skippedExisting}, Skipped (bad status): ${counts.skippedBadStatus}, Failed: ${counts.failed}`,
    );
};

main().catch(error => {
    console.error(error);
    process.exit(1);
});
