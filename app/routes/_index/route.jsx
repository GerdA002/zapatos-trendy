import { redirect, Form, useLoaderData, Link } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export async function loader({ request }) {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
}

export default function Index() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Bienvenido a Zapatos Trendy</h1>
        <p className={styles.text}>
          Tu solución completa para la gestión de calzado y productos de moda.
        </p>

        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Dominio de tu tienda</span>
              <input
                className={styles.input}
                type="text"
                name="shop"
                placeholder="mi-tienda"
                required
              />
              <span>ejemplo: mi-tienda.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Iniciar Sesión
            </button>
          </Form>
        )}

        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>Funcionalidades Principales</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <Link to="/dev/products" className={styles.listLink}>
                <div className={styles.listContent}>
                  <span className={styles.listIcon}></span>
                  <div className={styles.listText}>
                    <strong>Gestión de Productos</strong>
                  </div>
                  <span className={styles.listArrow}></span>
                </div>
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/dev/products" className={styles.listLink}>
                <div className={styles.listContent}>
                  <span className={styles.listIcon}></span>
                  <div className={styles.listText}>
                    <strong>Control de Inventario</strong>
                  </div>
                  <span className={styles.listArrow}></span>
                </div>
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/dev/products" className={styles.listLink}>
                <div className={styles.listContent}>
                  <span className={styles.listIcon}></span>
                  <div className={styles.listText}>
                    <strong>Análisis de Ventas</strong>
                  </div>
                  <span className={styles.listArrow}></span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
