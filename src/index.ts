import fs from 'node:fs'
import path from 'node:path';

interface StoreData {
  store_stock: string;
  store_currency: string;
  store_sell_multiplier: string;
  sold_item: string;
  sold_by: string;
}

interface FormattedData {
  sellMultiplier: number;
  items: Record<string, number>;
}

function main() {
  const text = fs.readFileSync(path.resolve('bucket.json'), 'utf8');
  const json: StoreData[] = JSON.parse(text);

  const result: Record<string, FormattedData> = {};
  for (const data of json) {
    const storeName = data.sold_by
      .replaceAll(/[^a-zA-Z ]+/g, '')
      .toUpperCase()
      .split(" ")
      .join("_")

    if (result[storeName]) {
      result[storeName]!.items[data.sold_item] = parseInt(data.store_stock);
      continue;
    }

    result[storeName] = {
      sellMultiplier: parseInt(data.store_sell_multiplier) / 10,
      items: { [data.sold_item]: parseInt(data.store_stock) }
    }
  }

  fs.writeFileSync(path.resolve('./stores.json'), JSON.stringify(result))
};


main();
