// JSON-LD Structured Data for RadioOS

interface RadioStationSchema {
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType: string;
  };
}

export function generateRadioStationSchema(radio: RadioStationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RadioStation',
    name: radio.name,
    description: radio.description,
    url: radio.url,
    image: radio.logo,
    sameAs: radio.sameAs || [],
    contactPoint: radio.contactPoint ? {
      '@type': 'ContactPoint',
      ...radio.contactPoint,
    } : undefined,
  };
}

interface PodcastSchema {
  name: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  episodeCount?: number;
}

export function generatePodcastSchema(podcast: PodcastSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: podcast.name,
    description: podcast.description,
    url: podcast.url,
    image: podcast.image,
    author: podcast.author ? {
      '@type': 'Organization',
      name: podcast.author,
    } : undefined,
    numberOfEpisodes: podcast.episodeCount,
  };
}

interface BroadcastEventSchema {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
}

export function generateBroadcastEventSchema(event: BroadcastEventSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BroadcastEvent',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location ? {
      '@type': 'Place',
      name: event.location,
    } : undefined,
  };
}

interface BreadcrumbSchema {
  items: Array<{ name: string; url: string }>;
}

export function generateBreadcrumbSchema(breadcrumb: BreadcrumbSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface WebsiteSchema {
  name: string;
  url: string;
  description?: string;
}

export function generateWebsiteSchema(website: WebsiteSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: website.name,
    url: website.url,
    description: website.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${website.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
