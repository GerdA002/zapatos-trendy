import { useLoaderData, useNavigate } from 'react-router';
import { PrismaClient } from '@prisma/client';
import { useState, useEffect } from 'react';

let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function loader() {
  try {
    const prisma = getPrismaClient();

    console.log('🔗 Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    const products = await prisma.shoeProduct.findMany({
      include: {
        variants: {
          orderBy: {
            size: 'asc'
          }
        },
        images: {
          orderBy: {
            position: 'asc'
          }
        },
        collections: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📦 Productos encontrados: ${products.length}`);

    const responseData = {
      success: true,
      products,
      total: products.length
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('❌ Error en loader:', error);

    // Datos de prueba como fallback
    const testProducts = [
      {
        id: "1",
        title: "Zapato Urbano Classic",
        description: "Zapato urbano elegante para uso diario, perfecto para looks casuales y semi-formales.",
        productType: "SNEAKERS",
        brand: "UrbanSteps",
        gender: "UNISEX",
        price: 89.99,
        material: "Cuero sintético",
        variants: [
          { id: "1", size: "38", color: "Negro", price: 89.99, inventory: 10, sku: "URB001-BLK-38" },
          { id: "2", size: "40", color: "Blanco", price: 89.99, inventory: 5, sku: "URB001-WHT-40" }
        ],
        images: [
          { id: "1", url: "/images/urbano-1.jpg", altText: "Zapato Urbano Classic frontal", position: 1 },
          { id: "2", url: "/images/urbano-2.jpg", altText: "Zapato Urbano Classic lateral", position: 2 }
        ],
        collections: [],
        featured: true,
        trending: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        title: "Running Pro Max",
        description: "Zapatilla running de alto rendimiento con tecnología de amortiguación avanzada.",
        productType: "SPORTS",
        brand: "RunFast",
        gender: "UNISEX",
        price: 129.99,
        material: "Malla transpirable",
        variants: [
          { id: "3", size: "39", color: "Rojo", price: 129.99, inventory: 15, sku: "RUN001-RED-39" },
          { id: "4", size: "41", color: "Azul", price: 129.99, inventory: 8, sku: "RUN001-BLU-41" }
        ],
        images: [
          { id: "3", url: "/images/running-1.jpg", altText: "Running Pro Max", position: 1 }
        ],
        collections: [],
        featured: false,
        trending: true,
        createdAt: new Date().toISOString()
      }
    ];

    const responseData = {
      success: true,
      products: testProducts,
      total: testProducts.length,
      usingFallback: true
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export default function DevProducts() {
  const initialData = useLoaderData();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialData.products || []);
  const [success, setSuccess] = useState(initialData.success || false);
  const [usingFallback, setUsingFallback] = useState(initialData.usingFallback || false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productType: 'SNEAKERS',
    brand: '',
    gender: 'UNISEX',
    price: 0,
    material: '',
    featured: false,
    trending: false,
    variants: [
      {
        size: '',
        color: '',
        price: 0,
        inventory: 0,
        sku: ''
      }
    ],
    images: [
      {
        url: '',
        altText: '',
        position: 1
      }
    ]
  });

  // Sincronizar con los datos del loader
  useEffect(() => {
    setProducts(initialData.products || []);
    setSuccess(initialData.success || false);
    setUsingFallback(initialData.usingFallback || false);
  }, [initialData]);

  // Inicializar formulario cuando se selecciona un producto para editar
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title || '',
        description: selectedProduct.description || '',
        productType: selectedProduct.productType || 'SNEAKERS',
        brand: selectedProduct.brand || '',
        gender: selectedProduct.gender || 'UNISEX',
        price: selectedProduct.price || 0,
        material: selectedProduct.material || '',
        featured: selectedProduct.featured || false,
        trending: selectedProduct.trending || false,
        variants: selectedProduct.variants.map(v => ({
          size: v.size || '',
          color: v.color || '',
          price: v.price || 0,
          inventory: v.inventory || 0,
          sku: v.sku || ''
        })),
        images: selectedProduct.images.map(img => ({
          url: img.url || '',
          altText: img.altText || '',
          position: img.position || 1
        }))
      });
    } else {
      // Resetear formulario para crear nuevo
      setFormData({
        title: '',
        description: '',
        productType: 'SNEAKERS',
        brand: '',
        gender: 'UNISEX',
        price: 0,
        material: '',
        featured: false,
        trending: false,
        variants: [{
          size: '',
          color: '',
          price: 0,
          inventory: 0,
          sku: ''
        }],
        images: [{
          url: '',
          altText: '',
          position: 1
        }]
      });
    }
  }, [selectedProduct, showCreateModal]);

  // 🔧 FUNCIONES PRINCIPALES

  // Función para regresar al inicio
  const handleGoHome = () => {
    navigate('/');
  };

  // Crear nuevo producto
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowCreateModal(true);
  };

  // Editar producto
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  // Ver detalles del producto
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    alert(`📋 Detalles de: ${product.title}\n\n📝 Descripción: ${product.description}\n💰 Precio: $${product.price}\n🏷️ Marca: ${product.brand}\n👟 Tipo: ${product.productType}\n🎯 Género: ${product.gender}\n📦 Variantes: ${product.variants.length}\n🖼️ Imágenes: ${product.images.length}`);
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        console.log('Eliminando producto:', productId);

        // Simular eliminación
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Actualizar estado local en lugar de recargar
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));

        alert('✅ Producto eliminado correctamente');
      } catch (error) {
        alert('❌ Error al eliminar el producto: ' + error.message);
      }
    }
  };

  // Editar variante
  const handleEditVariant = (variant, product) => {
    alert(`✏️ Editando variante:\n\n📦 Producto: ${product.title}\n📏 Talla: ${variant.size}\n🎨 Color: ${variant.color}\n💰 Precio: $${variant.price}\n📊 Stock: ${variant.inventory}\n🏷️ SKU: ${variant.sku}`);
  };

  // Exportar datos
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalProducts: products.length,
      totalVariants: products.reduce((sum, p) => sum + p.variants.length, 0),
      totalStock: products.reduce((sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.inventory, 0), 0),
      products: products.map(p => ({
        title: p.title,
        brand: p.brand,
        type: p.productType,
        price: p.price,
        variants: p.variants.length,
        stock: p.variants.reduce((sum, v) => sum + v.inventory, 0),
        featured: p.featured,
        trending: p.trending
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productos-zapatos-trendy-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('📊 Datos exportados correctamente');
  };

  // 🔧 FUNCIONES DEL FORMULARIO

  // Funciones para manejar variantes
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: '',
          color: '',
          price: prev.price,
          inventory: 0,
          sku: ''
        }
      ]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  // Funciones para manejar imágenes
  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: '',
          altText: '',
          position: prev.images.length + 1
        }
      ]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((image, i) =>
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  // Función para guardar el producto
  const handleSaveProduct = async () => {
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.title.trim()) {
        alert('❌ El nombre del producto es requerido');
        setIsLoading(false);
        return;
      }

      if (formData.variants.some(v => !v.size || !v.color || !v.sku)) {
        alert('❌ Todas las variantes deben tener talla, color y SKU');
        setIsLoading(false);
        return;
      }

      if (formData.images.some(img => !img.url)) {
        alert('❌ Todas las imágenes deben tener URL');
        setIsLoading(false);
        return;
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (selectedProduct) {
        // Actualizar producto existente
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === selectedProduct.id
              ? {
                  ...selectedProduct,
                  ...formData,
                  id: selectedProduct.id,
                  createdAt: selectedProduct.createdAt,
                  updatedAt: new Date().toISOString()
                }
              : p
          )
        );
        alert('✅ Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        const newProduct = {
          id: Date.now().toString(), // ID temporal
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          variants: formData.variants.map((v, index) => ({
            ...v,
            id: `temp-variant-${Date.now()}-${index}`
          })),
          images: formData.images.map((img, index) => ({
            ...img,
            id: `temp-image-${Date.now()}-${index}`
          })),
          collections: []
        };

        setProducts(prevProducts => [newProduct, ...prevProducts]);
        alert('✅ Producto creado correctamente');
      }

      setShowCreateModal(false);
      setSelectedProduct(null);

    } catch (error) {
      alert('❌ Error al guardar el producto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 BÚSQUEDA Y CÁLCULOS
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVariants = products.reduce((sum, product) => sum + product.variants.length, 0);
  const totalImages = products.reduce((sum, product) => sum + product.images.length, 0);
  const totalStock = products.reduce((sum, product) =>
    sum + product.variants.reduce((variantSum, variant) => variantSum + (variant.inventory || 0), 0), 0
  );

  if (!success) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <h1 style={styles.errorTitle}>❌ Error al cargar productos</h1>
          <p style={styles.errorText}>No se pudieron cargar los productos desde la base de datos</p>
          <button
            onClick={() => window.location.reload()}
            style={styles.retryButton}
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>👟 Catálogo de Zapatos</h1>
          <p style={styles.headerSubtitle}>Gestiona tu colección completa de calzado</p>
          {usingFallback && (
            <div style={styles.warningBanner}>
              ⚠️ Usando datos de prueba - Verifica la conexión a la base de datos
            </div>
          )}
        </div>
      </header>

      {/* Estadísticas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{products.length}</div>
            <div style={styles.statLabel}>Productos Totales</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎨</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{totalVariants}</div>
            <div style={styles.statLabel}>Variantes</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🖼️</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{totalImages}</div>
            <div style={styles.statLabel}>Imágenes</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{totalStock}</div>
            <div style={styles.statLabel}>Stock Total</div>
          </div>
        </div>
      </div>

      {/* Barra de acciones */}
      <div style={styles.actionsBar}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, marca o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.actionButtons}>
          <button
            onClick={handleExport}
            style={styles.secondaryButton}
          >
            📥 Exportar Datos
          </button>
          <button
            onClick={handleCreateProduct}
            style={styles.primaryButton}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searchTerm && (
        <div style={styles.searchResults}>
          <p>
            {filteredProducts.length === products.length
              ? `Mostrando todos los ${products.length} productos`
              : `🔍 ${filteredProducts.length} producto(s) encontrado(s) para "${searchTerm}"`
            }
          </p>
          {filteredProducts.length === 0 && (
            <button
              onClick={() => setSearchTerm('')}
              style={styles.clearSearchButton}
            >
              ✕ Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* Lista de Productos */}
      <div style={styles.content}>
        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👟</div>
            <h2 style={styles.emptyTitle}>
              {searchTerm ? 'No se encontraron productos' : 'No hay productos'}
            </h2>
            <p style={styles.emptyText}>
              {searchTerm
                ? 'No hay productos que coincidan con tu búsqueda.'
                : 'Tu catálogo está vacío. Comienza agregando nuevos productos.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateProduct}
                style={styles.primaryButton}
              >
                ➕ Crear Primer Producto
              </button>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={styles.secondaryButton}
              >
                ✕ Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={styles.productCard}>
                {/* Header del Producto */}
                <div style={styles.productHeader}>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productTitle}>{product.title}</h3>
                    <p style={styles.productDescription}>{product.description}</p>
                    <div style={styles.productMeta}>
                      <span style={styles.productBrand}>{product.brand}</span>
                      <span style={styles.productType}>{product.productType}</span>
                      <span style={styles.productGender}>{product.gender}</span>
                      {product.featured && <span style={styles.featuredBadge}>⭐ Destacado</span>}
                      {product.trending && <span style={styles.trendingBadge}>🔥 Tendencia</span>}
                    </div>
                  </div>
                  <div style={styles.productActions}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={styles.editButton}
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleViewProduct(product)}
                      style={styles.viewButton}
                      title="Ver detalles"
                    >
                      👀
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={styles.deleteButton}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Imágenes del Producto */}
                {product.images.length > 0 && (
                  <div style={styles.imagesSection}>
                    <h4 style={styles.sectionTitle}>🖼️ Imágenes ({product.images.length})</h4>
                    <div style={styles.imagesGrid}>
                      {product.images.map((image) => (
                        <div key={image.id} style={styles.imageCard}>
                          <div style={styles.imagePlaceholder}>
                            🖼️
                          </div>
                          <div style={styles.imageInfo}>
                            <div style={styles.imageUrl}>{image.url}</div>
                            {image.altText && (
                              <div style={styles.imageAlt}>Alt: {image.altText}</div>
                            )}
                            <div style={styles.imagePosition}>Posición: {image.position}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variantes del Producto */}
                <div style={styles.variantsSection}>
                  <h4 style={styles.sectionTitle}>🎨 Variantes ({product.variants.length})</h4>
                  <div style={styles.variantsGrid}>
                    {product.variants.map((variant) => (
                      <div key={variant.id} style={styles.variantCard}>
                        <div style={styles.variantHeader}>
                          <div style={styles.variantInfo}>
                            <strong style={styles.variantSize}>Talla: {variant.size}</strong>
                            <span style={styles.variantColor}>Color: {variant.color}</span>
                          </div>
                          <div style={styles.variantActions}>
                            <button
                              onClick={() => handleEditVariant(variant, product)}
                              style={styles.smallEditButton}
                              title="Editar variante"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                        <div style={styles.variantDetails}>
                          <div style={styles.variantPrice}>${variant.price}</div>
                          <div style={styles.variantStock}>
                            Stock: <span style={variant.inventory > 0 ? styles.inStock : styles.outOfStock}>
                              {variant.inventory}
                            </span>
                          </div>
                          <div style={styles.variantSku}>SKU: {variant.sku}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información adicional */}
                <div style={styles.productFooter}>
                  <div style={styles.footerInfo}>
                    <span style={styles.createdDate}>
                      Creado: {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                    {product.collections.length > 0 && (
                      <span style={styles.collections}>
                        Colecciones: {product.collections.map(c => c.title).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante para regresar al inicio */}
      <button
        onClick={handleGoHome}
        style={styles.floatingButton}
        title="Volver al inicio"
      >
        🏠
      </button>

      {/* Modal para crear/editar producto */}
      {showCreateModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>
              {selectedProduct ? '✏️ Editar Producto' : '➕ Crear Nuevo Producto'}
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveProduct();
            }} style={styles.form}>
              {/* Información Básica */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>📝 Información Básica</h3>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="product-title" style={styles.label}>Nombre del Producto *</label>
                    <input
                      id="product-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ej: Zapato Urbano Classic"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="product-brand" style={styles.label}>Marca *</label>
                    <input
                      id="product-brand"
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      placeholder="Ej: UrbanSteps"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="product-description" style={styles.label}>Descripción</label>
                  <textarea
                    id="product-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe el producto..."
                    style={styles.textarea}
                    rows="3"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="product-type" style={styles.label}>Tipo de Calzado *</label>
                    <select
                      id="product-type"
                      value={formData.productType}
                      onChange={(e) => setFormData({...formData, productType: e.target.value})}
                      style={styles.select}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="SNEAKERS">Sneakers</option>
                      <option value="BOOTS">Botas</option>
                      <option value="SANDALS">Sandalias</option>
                      <option value="LOAFERS">Mocasines</option>
                      <option value="DRESS_SHOES">Zapatos formales</option>
                      <option value="SPORTS">Deportivos</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="product-gender" style={styles.label}>Género *</label>
                    <select
                      id="product-gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      style={styles.select}
                      required
                    >
                      <option value="">Seleccionar género</option>
                      <option value="MEN">Hombre</option>
                      <option value="WOMEN">Mujer</option>
                      <option value="UNISEX">Unisex</option>
                      <option value="KIDS">Niños</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label htmlFor="product-price" style={styles.label}>Precio Base ($) *</label>
                    <input
                      id="product-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      placeholder="89.99"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="product-material" style={styles.label}>Material</label>
                    <input
                      id="product-material"
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                      placeholder="Ej: Cuero, Tela, Sintético"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Variantes */}
              <div style={styles.formSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>🎨 Variantes</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    style={styles.addButton}
                  >
                    ➕ Agregar Variante
                  </button>
                </div>

                {formData.variants.map((variant, index) => (
                  <div key={index} style={styles.variantFormCard}>
                    <div style={styles.variantHeader}>
                      <h4 style={styles.variantTitle}>Variante #{index + 1}</h4>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          style={styles.removeButton}
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label htmlFor={`variant-size-${index}`} style={styles.label}>Talla *</label>
                        <input
                          id={`variant-size-${index}`}
                          type="text"
                          value={variant.size}
                          onChange={(e) => updateVariant(index, 'size', e.target.value)}
                          placeholder="Ej: 38, 40, M, L"
                          style={styles.input}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor={`variant-color-${index}`} style={styles.label}>Color *</label>
                        <input
                          id={`variant-color-${index}`}
                          type="text"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          placeholder="Ej: Negro, Rojo, Azul"
                          style={styles.input}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor={`variant-stock-${index}`} style={styles.label}>Stock *</label>
                        <input
                          id={`variant-stock-${index}`}
                          type="number"
                          min="0"
                          value={variant.inventory}
                          onChange={(e) => updateVariant(index, 'inventory', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label htmlFor={`variant-sku-${index}`} style={styles.label}>SKU *</label>
                        <input
                          id={`variant-sku-${index}`}
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          placeholder="Ej: URB001-BLK-38"
                          style={styles.input}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor={`variant-price-${index}`} style={styles.label}>Precio Variante ($)</label>
                        <input
                          id={`variant-price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || formData.price)}
                          placeholder="Igual al precio base"
                          style={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Imágenes */}
              <div style={styles.formSection}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>🖼️ Imágenes</h3>
                  <button
                    type="button"
                    onClick={addImage}
                    style={styles.addButton}
                  >
                    ➕ Agregar Imagen
                  </button>
                </div>

                {formData.images.map((image, index) => (
                  <div key={index} style={styles.imageFormCard}>
                    <div style={styles.variantHeader}>
                      <h4 style={styles.variantTitle}>Imagen #{index + 1}</h4>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={styles.removeButton}
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label htmlFor={`image-url-${index}`} style={styles.label}>URL de la Imagen *</label>
                        <input
                          id={`image-url-${index}`}
                          type="url"
                          value={image.url}
                          onChange={(e) => updateImage(index, 'url', e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          style={styles.input}
                          required
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor={`image-alt-${index}`} style={styles.label}>Texto Alternativo</label>
                        <input
                          id={`image-alt-${index}`}
                          type="text"
                          value={image.altText}
                          onChange={(e) => updateImage(index, 'altText', e.target.value)}
                          placeholder="Descripción de la imagen"
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor={`image-position-${index}`} style={styles.label}>Posición</label>
                        <input
                          id={`image-position-${index}`}
                          type="number"
                          min="1"
                          value={image.position}
                          onChange={(e) => updateImage(index, 'position', parseInt(e.target.value) || 1)}
                          style={styles.input}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Opciones Adicionales */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>⚙️ Opciones Adicionales</h3>

                <div style={styles.checkboxGroup}>
                  <label htmlFor="featured-checkbox" style={styles.checkboxLabel}>
                    <input
                      id="featured-checkbox"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      style={styles.checkbox}
                    />
                    ⭐ Producto Destacado
                  </label>

                  <label htmlFor="trending-checkbox" style={styles.checkboxLabel}>
                    <input
                      id="trending-checkbox"
                      type="checkbox"
                      checked={formData.trending}
                      onChange={(e) => setFormData({...formData, trending: e.target.checked})}
                      style={styles.checkbox}
                    />
                    🔥 Producto en Tendencia
                  </label>
                </div>
              </div>

              {/* Acciones del Modal */}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={styles.cancelButton}
                >
                  ❌ Cancelar
                </button>

                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Guardando...' : (selectedProduct ? '💾 Actualizar Producto' : '🚀 Crear Producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// ... (el código anterior se mantiene igual)

// ESTILOS COMPLETOS - CORREGIDOS
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  },
  headerTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  headerSubtitle: {
    margin: '0',
    color: '#6b7280',
    fontSize: '1.1rem'
  },
  warningBanner: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
    color: '#92400e',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    marginTop: '1rem',
    fontWeight: '600',
    display: 'inline-block',
    border: '2px solid #f59e0b'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  statIcon: {
    fontSize: '2.5rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    color: 'white'
  },
  statInfo: {
    flex: 1
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1f2937',
    margin: '0'
  },
  statLabel: {
    color: '#6b7280',
    fontWeight: '600',
    margin: '0'
  },
  actionsBar: {
    maxWidth: '1200px',
    margin: '0 auto 2rem auto',
    padding: '0 2rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  searchContainer: {
    flex: '1',
    minWidth: '300px'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    fontSize: '1rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    outline: 'none'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
  },
  searchResults: {
    maxWidth: '1200px',
    margin: '0 auto 1rem auto',
    padding: '0 2rem',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  clearSearchButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    backdropFilter: 'blur(10px)'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem 2rem 2rem'
  },
  emptyState: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '4rem 2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 1rem 0'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '1.1rem',
    margin: '0 0 2rem 0',
    lineHeight: '1.6'
  },
  productsGrid: {
    display: 'grid',
    gap: '2rem'
  },
  productCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  productInfo: {
    flex: '1',
    minWidth: '300px'
  },
  productTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem 0'
  },
  productDescription: {
    color: '#6b7280',
    margin: '0 0 1rem 0',
    lineHeight: '1.5'
  },
  productMeta: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  productBrand: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  productType: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  productGender: {
    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  featuredBadge: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  trendingBadge: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  productActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  editButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagesSection: {
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 1rem 0'
  },
  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem'
  },
  imageCard: {
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center'
  },
  imagePlaceholder: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  imageInfo: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  imageUrl: {
    wordBreak: 'break-all',
    marginBottom: '0.25rem'
  },
  imageAlt: {
    marginBottom: '0.25rem'
  },
  imagePosition: {
    fontSize: '0.75rem',
    opacity: '0.7'
  },
  variantsSection: {
    marginBottom: '1.5rem'
  },
  variantsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem'
  },
  variantCard: {
    background: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    padding: '1rem'
  },
  variantHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  variantInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  variantSize: {
    fontSize: '1rem',
    color: '#1f2937'
  },
  variantColor: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  variantActions: {
    display: 'flex',
    gap: '0.25rem'
  },
  smallEditButton: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    padding: '0.25rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  variantDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  variantPrice: {
    color: '#059669',
    fontWeight: '600',
    textAlign: 'center'
  },
  variantStock: {
    textAlign: 'center'
  },
  inStock: {
    color: '#059669',
    fontWeight: '600'
  },
  outOfStock: {
    color: '#ef4444',
    fontWeight: '600'
  },
  variantSku: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: '0.75rem'
  },
  productFooter: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    paddingTop: '1rem'
  },
  footerInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  createdDate: {
    fontWeight: '600'
  },
  collections: {
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#7c3aed',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontWeight: '600'
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    zIndex: '1000'
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 2rem 0',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  formSection: {
    background: 'rgba(249, 250, 251, 0.5)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white'
  },
  addButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  variantFormCard: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  // CORREGIDO: Cambiado de variantHeader a formVariantHeader
  formVariantHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  variantTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
  },
  removeButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageFormCard: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  // CORREGIDO: Cambiado de variantHeader a formImageHeader
  formImageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    color: '#374151'
  },
  checkbox: {
    width: '1.25rem',
    height: '1.25rem'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },
  cancelButton: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  errorContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  errorContent: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '3rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%'
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ef4444',
    margin: '0 0 1rem 0'
  },
  errorText: {
    color: '#6b7280',
    fontSize: '1.1rem',
    margin: '0 0 2rem 0',
    lineHeight: '1.6'
  },
  retryButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  }
};
