const shopifyObjectInfo = () => {
  if(!window.Shopify) {
    return {success: false}
  }

  return window.Shopify
}

console.log(shopifyObjectInfo())
