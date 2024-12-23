import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  //Brightdata proxy config
  const username = String(process.env.BRIGHTDATA_USERNAME);
  const password = String(process.env.BRIGHTDATA_PASSWORD);
  const port = 33335;
  const session_id = (10000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: `${password}`,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    // console.log(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price")
    );

    const originalPrice = extractPrice(
      $("#priceBlock_ourPrice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    const outofstock =
      $("#availability").text().trim().toLowerCase() ===
      "currently unavailable";
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const imageUrls = Object.keys(JSON.parse(images));
    const currency = extractCurrency($(".a-price-symbol"));

    //construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice,
      originalPrice: Number(originalPrice),
      discountRate: Number(discountRate),
      priceHistory: [],
      category: "category",
      stars: 4.5,
      isOutOfStock: outofstock,
    };
    console.log(data);
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
