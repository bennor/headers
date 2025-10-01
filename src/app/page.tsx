import { headers } from 'next/headers';

export default async function Home() {
  const headersList = await headers();
  const rawHeaders = Object.fromEntries(headersList.entries());
  
  console.log('Raw header data:', rawHeaders);
  
  const sensitivePatterns = ['bearer', 'authorization', 'token', 'signature'];
  
  const shouldRedact = (key: string, value: string) => {
    const keyLower = key.toLowerCase();
    const valueLower = value.toLowerCase();
    return sensitivePatterns.some(pattern => 
      keyLower.includes(pattern) || valueLower.includes(pattern)
    );
  };
  
  const headersArray = Array.from(headersList.entries())
    .map(([name, value]) => [
      name, 
      shouldRedact(name, value) ? '[REDACTED]' : value
    ])
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="font-sans min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Request Headers</h1>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <dl className="space-y-3">
            {headersArray.map(([name, value]) => (
              <div key={name} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                <dt className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {name}
                </dt>
                <dd className="text-gray-700 dark:text-gray-300 font-mono text-sm break-all">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
  );
}
