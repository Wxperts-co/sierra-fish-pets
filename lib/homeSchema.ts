export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.sierrafishandpets.com/#website",
      "url": "https://www.sierrafishandpets.com/",
      "name": "Sierra Fish & Pets",
      "publisher": {
        "@id": "https://www.sierrafishandpets.com/#localbusiness"
      },
      "creator": {
        "@type": "Organization",
        "name": "Wxperts Inc.",
        "url": "https://www.wxperts.co"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.sierrafishandpets.com/#webpage",
      "url": "https://www.sierrafishandpets.com/",
      "name": "Sierra Fish & Pets | Renton Pet Store & Aquariums WA",
      "description": "Shop premium pet supplies, tropical fish, dog & cat food, reptiles, and custom aquarium design & maintenance at Sierra Fish & Pets in Renton, WA.",
      "isPartOf": {
        "@id": "https://www.sierrafishandpets.com/#website"
      },
      "about": {
        "@id": "https://www.sierrafishandpets.com/#localbusiness"
      },
      "mainEntity": {
        "@id": "https://www.sierrafishandpets.com/#localbusiness"
      },
      "creator": {
        "@type": "Organization",
        "name": "Wxperts Inc.",
        "url": "https://www.wxperts.co"
      }
    },
    {
      "@type": "PetStore",
      "@id": "https://www.sierrafishandpets.com/#localbusiness",
      "name": "Sierra Fish & Pets",
      "description": "Renton's premier local pet store and custom aquarium specialist, proudly serving the community with premium pet supplies and expert aquatic services since 1972.",
      "url": "https://www.sierrafishandpets.com/",
      "image": "https://www.sierrafishandpets.com/",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "601 S Grady Way",
        "addressLocality": "Renton",
        "addressRegion": "WA",
        "postalCode": "98057",
        "addressCountry": "US"
      },
      "knowsAbout": [
        "Pet Supplies",
        "Tropical Fish",
        "Dog Food",
        "Cat Food",
        "Reptiles",
        "Custom Aquarium Design",
        "Aquarium Maintenance",
        "Aquarium Installation",
        "Pet Grooming Services"
      ],
      "sameAs": [
        "https://www.youtube.com/@sierrafishpetsrenton",
        "https://www.instagram.com/sierraspetswa/",
        "https://www.facebook.com/SierraFishandPets/",
        "https://www.youtube.com/channel/UCniMRwcin9mKyM7AKFc8pwA",
        "https://www.yelp.com/biz/sierra-fish-and-pets-renton"
      ],
      "areaServed": {
        "@type": "City",
        "name": "Renton"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pet Supplies and Aquarium Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Aquarium Consulting & Design",
              "description": "Custom aquarium design and consulting for homes and offices."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Aquarium Installation",
              "description": "Professional aquarium setup and installation services."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Aqua Jet Water Cleaning System",
              "description": "Advanced cleaning and maintenance solutions for aquariums."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Aquarium Water Testing",
              "description": "In-store water testing for freshwater and saltwater setups."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pet Nails and Wing Trim",
              "description": "Grooming services including pet nail and wing trimming."
            }
          }
        ]
      }
    }
  ]
};
