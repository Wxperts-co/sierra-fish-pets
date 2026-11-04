export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebSite"],
      "@id": "https://sierrafishandpets.com/#website",
      "url": "https://sierrafishandpets.com",
      "name": "Sierra Fish & Pets",
      "description": "Renton's Premier Local Pet Store & Custom Aquarium Specialists Since 1972",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://sierrafishandpets.com/shop?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": ["PetStore", "LocalBusiness", "Store"],
      "@id": "https://sierrafishandpets.com/#store",
      "name": "Sierra Fish & Pets",
      "alternateName": "Sierra Fish and Pets",
      "url": "https://sierrafishandpets.com",
      "logo": "https://sierrafishandpets.com/images/logo/sierra-logo.png",
      "image": [
        "https://sierrafishandpets.com/images/banner/shophero3.png",
        "https://sierrafishandpets.com/images/banner/about2.png"
      ],
      "telephone": "+1-425-226-3215",
      "priceRange": "$$",
      "founder": {
        "@type": "Person",
        "name": "Mr. JONAS STERNBERG"
      },
      "foundingDate": "1972",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "601 S Grady Way",
        "addressLocality": "Renton",
        "addressRegion": "WA",
        "postalCode": "98057",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.4727,
        "longitude": -122.2135
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "11:00",
          "closes": "19:00"
        }
      ],
      "hasMap": "https://maps.app.goo.gl/48Q7dQBbespuFhX27",
      "about": [
        {
          "@type": "Thing",
          "name": "Custom Aquarium Design, Installation & Maintenance",
          "description": "Professional residential and commercial custom aquariums, live fish, and maintenance services in Renton, WA."
        },
        {
          "@type": "Thing",
          "name": "Full-Line Pet Supplies",
          "description": "Premium foods and care supplies for dogs, cats, birds, reptiles, and small animals."
        }
      ]
    }
  ]
};

