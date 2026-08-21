import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://radioos-sadekhs-projects.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    // Get all public radio pages
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: radios } = await supabase
      .from('radios')
      .select('slug, updated_at')
      .eq('is_public', true)
      .limit(1000);

    const radioPages: MetadataRoute.Sitemap = (radios || []).map((radio) => ({
      url: `${baseUrl}/radio/${radio.slug}`,
      lastModified: new Date(radio.updated_at),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...staticPages, ...radioPages];
  } catch (error) {
    // Return static pages if database query fails
    return staticPages;
  }
}
