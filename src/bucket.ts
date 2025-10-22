import fs from "node:fs";
import path from "node:path";

async function getBucket() {
  const url = new URL('https://oldschool.runescape.wiki/api.php?action=bucket');

  url.searchParams.set('format', 'json');

  let lastPage = false;
  const bucket = [];

  for (let offset = 0; !lastPage; offset += 500) {
    url.searchParams.set('query',
      `bucket('storeline') \
        .select('sold_by', 'sold_item', 'store_stock', 'store_currency', 'store_sell_multiplier', 'store_delta') \
        .where('store_currency', '=', 'Coins') \
        .where('store_stock', '>=', '0') \
        .where('store_stock', '!=', 'N/A') \
        .offset(${offset}) \
        .run()`
    );

    const response = await fetch(url);
    const json = await response.json() as Record<'bucket', unknown[]>;

    if (json.bucket.length < 500)
      lastPage = true;

    bucket.push(...json.bucket);
  }

  fs.writeFileSync(path.resolve('./bucket.json'), JSON.stringify(bucket))
}

await getBucket();
