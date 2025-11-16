
import { authenticate } from '../../shopify.server.js';

export function loader({ request }) {
  return authenticate.admin(request)
    .then(({ admin }) => {
      return admin.rest.resources.CustomCollection.all({
        session: admin.session,
      });
    })
    .then(collections => {
      return json({
        success: true,
        collections: collections.data
      });
    })
    .catch(error => {
      return json({
        success: false,
        error: error.message
      }, { status: 500 });
    });
}
