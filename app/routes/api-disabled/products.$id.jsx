
import { authenticate } from '../../shopify.server.js';

export function loader({ request, params }) {
  const { id } = params;

  return authenticate.admin(request)
    .then(({ admin }) => {
      return admin.rest.resources.Product.find({
        session: admin.session,
        id: id,
      });
    })
    .then(product => {
      return json({ success: true, product });
    })
    .catch(error => {
      return json({ success: false, error: error.message }, { status: 404 });
    });
}

export function action({ request, params }) {
  const { id } = params;

  if (request.method === 'PUT') {
    return request.json()
      .then(updates => {
        return authenticate.admin(request)
          .then(({ admin }) => {
            return admin.rest.resources.Product.find({
              session: admin.session,
              id: id,
            });
          })
          .then(product => {

            // Actualizando campos
            Object.keys(updates).forEach(key => {
              if (updates[key] !== undefined) {
                product[key] = updates[key];
              }
            });

            return product.save();
          })
          .then(product => {
            return json({ success: true, product });
          });
      })
      .catch(error => {
        return json({ success: false, error: error.message }, { status: 400 });
      });

  } else if (request.method === 'DELETE') {
    return authenticate.admin(request)
      .then(({ admin }) => {
        return admin.rest.resources.Product.delete({
          session: admin.session,
          id: id,
        });
      })
      .then(() => {
        return json({ success: true, message: 'Producto eliminado' });
      })
      .catch(error => {
        return json({ success: false, error: error.message }, { status: 400 });
      });
  }

  return json({ error: 'Método no permitido' }, { status: 405 });
}
