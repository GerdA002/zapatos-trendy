
import { authenticate } from '../../shopify.server.js';

export function action({ request }){
  if(request.method !=='POST'){
    return json({error: 'Metodo no permitido' },{status:405});
  }
  return request.json().then(productData=>{
    return authenticate.admin(request)
    .then(({ admin })=>{
      const product = new admin.rest.resources.Product({
        session:admin.session,
      });

      //Mapeando datos de zapatos a formato de Shopify
      product.title=productData.title;
      product.body_html=productData.description || '';
      product.product_type=productData.product_type||'Shoes';
      product.vendor=productData.brand||'Zapatos Trendy';
      product.tags=productData.tags||'zapatos, calzado';

      //Para variantes(tallas,colores) si las hay
      if(productData.variants && productData.variants.length>0){
        product.variants=productData.variants.map(variant=>({
          option1:variant.size,
          option2:variant.color,
          price:variant.price,
          sku:variant.sku,
          inventory_quantity: variant.inventory,
        }));
      }

      //Para imagenes
      if(productData.images &&productData.images.length>0){
        product.images=productData.images.map(img=>({
          src:img.url,
          alt:img.alText,
        }));
      }

      return product.save();
    })
    .then(product=>{
      return json({
        success:true,
        product:product
      },{status:201});
    });
  })
  .catch(error=>{
    return json({
      success:false,
      error:error.messaje
    },{status:400});
  });
}



