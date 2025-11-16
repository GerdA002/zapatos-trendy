export const shoeDemoData = {
  sizeCharts: [
    {
      brand: "UrbanSteps",
      type: "SNEAKERS",
      euSizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
      usSizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
      ukSizes: ["4", "5", "6", "7", "8", "9", "10", "11", "12"],
      cmSizes: [23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27]
    },
    {
      brand: "EleganceHeels",
      type: "HEELS",
      euSizes: ["35", "36", "37", "38", "39"],
      usSizes: ["5", "6", "7", "8", "9"],
      ukSizes: ["3", "4", "5", "6", "7"],
      cmSizes: [22, 22.5, 23, 23.5, 24]
    }
  ],

  collections: [
    {
      handle: "urban-collection",
      title: "Colección Urbana",
      description: "Zapatos modernos para la ciudad",
      imageUrl: "/images/urban-collection.jpg"
    },
    {
      handle: "running-collection",
      title: "Colección Running",
      description: "Zapatillas deportivas para correr",
      imageUrl: "/images/running-collection.jpg"
    }
  ],

  products: [
    {
      title: "Zapato Urbano Classic",
      handle: "zapato-urbano-classic",
      description: "Zapato urbano elegante y cómodo para el día a día",
      productType: "Sneakers",
      brand: "UrbanSteps",
      gender: "unisex",
      material: "Cuero sintético",
      featured: true,
      trending: false,
      variants: [
        {
          size: "40",
          color: "Negro",
          colorHex: "#000000",
          price: 89.99,
          sku: "URB-CL-BLK-40",
          inventory: 25
        },
        {
          size: "42",
          color: "Negro",
          colorHex: "#000000",
          price: 89.99,
          sku: "URB-CL-BLK-42",
          inventory: 15
        }
      ],
      images: [
        {
          url: "/images/urbano-classic-1.jpg",
          altText: "Zapato Urbano Classic - Vista frontal",
          position: 1
        }
      ]
    }
    // ... más productos
  ]
};
