import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Food Comparison</h1>
      <p>
        Explore foods by their nutritional profiles, environmental footprints,
        and the ethical dimensions of how they are produced.
      </p>
      <Link href="/foods">Browse all foods &rarr;</Link>
    </div>
  );
}
