
import { authenticate } from '../../shopify.server.js'


export function loader({ request }){
  return authenticate.admin(request)
  .then(({admin}) =>{
    return admin.rest.resources.Product.all({
      session: admin.session,
    });
  })
  .then(products =>{
    return json({
      seccess:true,
      products: products.data
    });
  })
  .catch(error => {
    return json({
      success:false,
      error: error.message
    },{status:500});
  });
}
