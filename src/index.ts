import fs from 'node:fs'
import path from 'node:path';

interface ShopData {
  store_stock: string;
  store_currency: string;
  store_sell_multiplier: string;
  store_delta: string;
  sold_item: string;
  sold_by: string;
}

interface FormattedData {
  sellMultiplier: number;
  shopDelta: number;
  itemStocks: Record<string, number>;
}

function main() {
  const text = fs.readFileSync(path.resolve('bucket.json'), 'utf8');
  const json: ShopData[] = JSON.parse(text);

  const result: Record<string, FormattedData> = {};
  for (const data of json) {
    const shopName = data.sold_by
      .replaceAll(/[^a-zA-Z ]+/g, '')
      .trim()
      .toUpperCase()
      .split(/\s+/g)
      .join("_")

    if (result[shopName]) {
      result[shopName]!.itemStocks[data.sold_item] = parseInt(data.store_stock);
      continue;
    }

    result[shopName] = {
      shopDelta: parseInt(data.store_delta) / 10,
      sellMultiplier: parseInt(data.store_sell_multiplier) / 10,
      itemStocks: { [data.sold_item]: parseInt(data.store_stock) }
    }
  }

  fs.writeFileSync(path.resolve('./shops.json'), JSON.stringify(result))
};


main();
