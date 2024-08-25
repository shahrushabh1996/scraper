const axios = require('axios');
const mongoose = require('mongoose');

const uri = "mongodb://rushabhparallels2024:GtfsPq8RbJLzKJOM@54.81.38.101:27017/crunchbase?authSource=admin";

class Crunchbase {
    constructor() {
        this.db;
    }

    async connectMongoDB() {
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
      
        this.db = mongoose.connection;
    }

    async fetchCompanies(afterId) {
        const body = {
            'field_ids': [
              'identifier',
              'categories',
              'location_identifiers',
              'short_description',
              'rank_org_company',
              'location_group_identifiers',
              'hq_postal_code',
              'diversity_spotlights',
              'revenue_range',
              'operating_status',
              'founded_on',
              'exited_on',
              'closed_on',
              'company_type',
              'website',
              'twitter',
              'facebook',
              'linkedin',
              'contact_email',
              'phone_number',
              'num_articles',
              'hub_tags',
              'description',
              'job_posting_link_source',
              'num_sub_organizations',
              'investor_type',
              'investor_stage',
              'num_portfolio_organizations',
              'num_investments_funding_rounds',
              'num_lead_investments',
              'num_diversity_spotlight_investments',
              'num_exits',
              'num_exits_ipo',
              'program_type',
              'program_application_deadline',
              'program_duration',
              'school_type',
              'school_program',
              'num_enrollments',
              'school_method',
              'num_founder_alumni',
              'num_alumni',
              'category_groups',
              'num_founders',
              'founder_identifiers',
              'num_employees_enum',
              'num_funding_rounds',
              'funding_stage',
              'last_funding_at',
              'last_funding_total',
              'last_funding_type',
              'last_equity_funding_total',
              'last_equity_funding_type',
              'equity_funding_total',
              'funding_total',
              'investor_identifiers',
              'num_lead_investors',
              'num_investors',
              'num_acquisitions',
              'acquisition_status',
              'acquisition_identifier',
              'acquirer_identifier',
              'acquisition_announced_on',
              'acquisition_price',
              'acquisition_type',
              'acquisition_terms',
              'ipo_status',
              'went_public_on',
              'delisted_on',
              'ipo_amount_raised',
              'ipo_valuation',
              'stock_symbol',
              'stock_exchange_symbol',
              'growth_insight_indicator',
              'growth_insight_confidence',
              'last_layoff_date',
              'last_key_employee_change_date',
              'num_event_appearances',
              'rank_org',
              'rank_org_school',
              'rank_delta_d7',
              'rank_delta_d30',
              'rank_delta_d90',
              'num_org_similarities',
              'contact_job_departments',
              'num_private_contacts',
              'num_contacts',
              'semrush_visits_latest_month',
              'semrush_visits_latest_6_months_avg',
              'semrush_visits_mom_pct',
              'semrush_visit_duration',
              'semrush_visit_duration_mom_pct',
              'semrush_visit_pageviews',
              'semrush_visit_pageview_mom_pct',
              'semrush_bounce_rate',
              'semrush_bounce_rate_mom_pct',
              'semrush_global_rank',
              'semrush_global_rank_mom',
              'semrush_global_rank_mom_pct',
              'builtwith_num_technologies_used',
              'apptopia_total_apps',
              'apptopia_total_downloads',
              'siftery_num_products',
              'ipqwery_num_patent_granted',
              'ipqwery_num_trademark_registered',
              'ipqwery_popular_patent_category',
              'ipqwery_popular_trademark_class',
              'aberdeen_site_it_spend',
              'privco_valuation_range',
              'privco_valuation_timestamp',
              'num_private_notes',
              'private_tags',
              'num_xrm_deals',
              'num_xrm_accounts',
              'xrm_account_owners',
              'xrm_account_types'
            ],
            'order': [
              {
                'field_id': 'rank_org_company',
                'sort': 'asc'
              }
            ],
            'query': [],
            'field_aggregators': [],
            'collection_id': 'organization.companies',
            'limit': 1000
        };

        if (typeof afterId === 'string') body.after_id = afterId;

        const response = await axios.post(
            'https://www.crunchbase.com/v4/data/searches/organization.companies',
            body,
            {
              params: {
                'source': 'collection_advanced_search'
              },
              headers: {
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'cookie': '_gcl_gs=2.1.k1$i1721993485; _gcl_au=1.1.2087770426.1721993489; _gcl_aw=GCL.1721993489.CjwKCAjwko21BhAPEiwAwfaQCCGCEuIWidiW_XO7cair-cHRsycPlo99oVPOhI9w5tU_JJ7GP1yF1xoCKasQAvD_BwE; _mkto_trk=id:976-JJA-800&token:_mch-crunchbase.com-1721993490106-90670; _fbp=fb.1.1721993490274.398673059325807534; cb_analytics_consent=granted; cid=CiiivmajiRdw2gAbLOHXAg==; _ga_4N77WNB622=GS1.1.1721993488.1.0.1721993495.0.0.0; featureFlagOverride=%7B%7D; pxcts=9e2a7bbc-4b42-11ef-8762-d8946eb60fe2; _pxvid=9e2a6df1-4b42-11ef-8762-f5696836cf12; _gid=GA1.2.1838179211.1721993498; drift_aid=ed5e8eee-86f7-48d9-952a-3cb67e850deb; driftt_aid=ed5e8eee-86f7-48d9-952a-3cb67e850deb; drift_eid=9cd676d4-3efd-4565-bd68-9fd3d1524709; _hp2_props.973801186=%7B%22Logged%20In%22%3Atrue%2C%22Pro%22%3Atrue%2C%22cbPro%22%3Atrue%7D; _delighted_web={%220SrRdbRV9pdk0Aem%22:{%22_delighted_fst%22:{%22t%22:%221721994044502%22}}}; _hp2_id.973801186=%7B%22userId%22%3A%221008312324497589%22%2C%22pageviewId%22%3A%22194632271860272%22%2C%22sessionId%22%3A%221346779936955745%22%2C%22identity%22%3A%22rushabhcrunchbase2024%40gmail.com%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%7D; __cflb=02DiuJLCopmWEhtqNz3x2VesGhPn4wGcKdaLD3qdNe1Bi; xsrf_token=oaPYVNszfs3UuVHBWbehpLK4TVYJMF4CIcwMEkwxwAM; __cf_bm=1h99JKyos9L.BgratcRlyWKG_N91TYBxERDUxrHOtzc-1722085313-1.0.1.1-e4cWXWo2NkG1zxs31grhNg.TYwzyFC6mio57pHkETJH4kalx3owWbf57Vp0HIlxoGKyc2QCCEmH88NeWtbuIrw; authcookie=eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhNDc3YTVhYi0xZTcwLTRkZGYtYjgxYy1kMDFmNGI1YjgyMmMiLCJpc3MiOiJ1c2Vyc2VydmljZV8yMTQzODk4M183MzciLCJzdWIiOiI5Y2Q2NzZkNC0zZWZkLTQ1NjUtYmQ2OC05ZmQzZDE1MjQ3MDkiLCJleHAiOjE3MjIwODU2NTQsImlhdCI6MTcyMjA4NTM1NCwicHJpdmF0ZSI6IlhBbVRTc2V5enVsWjVuRE5BTnlJOTBoQUxkVVRpSUJwSzBlTUFkTWNrdlhsZFVIN29GWDZPY3dDRi8rR0cvVTVQK09OcTRzMjl4emZoNzNnZWE0VDRoVkZYZ0dVTkFuSGY4UVlSKzRtQmJSb0lQc3hFc2pveFVYYmorYnYyNmdVMU9MR2dJMytSNHBTUFFFcjFTQ1dmdW0wWjJMdUdnVXJLcGowQnVEOGh3N3pOL213bWtLU1RLalBBbm05a09ORzZYYjg5aG1QNkVUQThMSlVZNGlvb1JXTWRCQmpGMkEzYkwxU0FpRGFrdFkxUkY2VWxEYmdrdXNudjFkVWVMYVd6bGF0eldIY3Z3TTRVUkhTM1g1Y05aY3FSTXBTSWlIN0R0YjdNNHV2SndTVXZVdWVLRmVSNCt4SEZ5STFMajhnNjBESWkxOVNYa0YyOXc1M0lUcnVPMlduS0pvS250ZFEyUVRqYXRjWkJJS014VVdSL3ZrU3dWd3V3MUx4NCszY2taUWhKSldWcUlUQ1JucFpiZVZmblQxY2hIV1JmZFZIUmM3aEwzMUY2YlY3VkNZcnVodnVNbWdSazVLWm93a0hEeU5ZTllSRlhHM0V1K1hnOTE4Ri94elRXNVBYZEh2VDJWVDhoTytRK0QrNFE0TmRIeDVDeU1xTGt3Rjk3cHp4NTdreTNJYnVKa1AreUg3ajFqYlltK2N1Q1hSbjZGMzhrQkZIL1RqMEpFS2pZL1IzUXgwQmtJSnJPM2FLMWZzVzZhTU9pMGhSWGNKcjZqeFowUzNSQzEvN2x6M3oxT3ZRc2VKUW5hY09pNnVCTDNoVGl2ZVl1dXE3MWhjVjhWbDEyUnRwWTdvV2VZOExzQnJLMWN4TnpoMzA1c3NiWk4yaU5nMGVuc0ljU1ZVK01ZZnRRZzMvN0kvSmVXdTFVUGRtbG1ZdTduMURTeVJveWlERzg2WmZRb08vakxYakZQbytua0tpQXVINWFpaThFQ0JnVTl4a09mT3kzZXU0a29FcmJlT2hlL25FUVJtNURzRlV1UGdTc1pCcUV5NVRNVkVTQjY2MVlYSUxjTmxISGUxa1JtQm90M0lUekFsSmFsNi9NL3NSUFNjLzdOeFV3UmVWRXdZVzRHaldldElmVTkwSEhPU2xYTWxmZ2VvejF6djlCZHc2SFlBUkptTzJ6bWRzZW55TFZWUW1BRmY5TnNkMmNmV3JlWXZBUWo2YmUzdlA3Und5dldSUElIVG1DY0xUaDBpRFBDTTJ5SklndjFXYlhHQ3ovazYxUHhDKysvNzQxTjh4TVBsWU1ncVk5RzdwY2RLYUFGamx6amZ3WXJPU1YzU0JZUVAzZE1XZkFGLytkcE9KODBIUGZETzVYMW8wWjVTWXFQQm90WFFGaEg5L3I5dG9LNTFKK0ZPZ1FzRzZyUGl5MlZjNThBMjVYYjhzOFBNb3U1Nngyb2VubWRHcGJpWFY2STFxdHZ0SER4VlZaaXpsamJHekU5Yz0iLCJwdWJsaWMiOnsic2Vzc2lvbl9oYXNoIjoiMTMwODE2MjAwNiJ9fQ.2s6VINKn8Ntzut8QS81latUojiIU6letqhJzuNh9unI8F4b1Fit9FARnrCOoBnFONnmGS47qFbTB-NJc-y6LdA; drift_campaign_refresh=ddb8f18c-44a6-49bc-9b15-618a0e7a1baa; _px3=57bf4d00c098b52b1b00aebf202938f5981d0cfc3908d2f373fc70e2686cc9ab:xfwQICdhcieWHtDhNu2JLVfR2+kBz7A92r2AwHB1S5H57jMwr0Pjv+Dkro0O9jJZmPdQEJkIHglESRegzvjoRg==:1000:cdBKs7XwtW4Gabo1q5E/Fa1YVd1z8gjp/0gebSJdJNBaKdHAQ20gxUTOKk29uRS9ged5kIOgfV5Fk1HoWgNx6eus42rL7SWjIZ/ojMaqx2rDuzQTWuw7WEu55gyct8mfzKlsOjJbnEK3P42hEoIQ8XAzXofVoLYImNQvRH/WIj+BMdK6ClESR2a2OV+p87ccITwjulsrxJlULZTYBBFYfJGyl5VVo3Ev4f3zy/GrdLo=; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Jul+27+2024+18%3A32%3A54+GMT%2B0530+(India+Standard+Time)&version=202304.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false; _uetsid=9a6bc3c04b4211ef806df3efe303ba37; _uetvid=9a6be0e04b4211ef9db819c4280afdd8; _ga=GA1.2.1848318772.1721993489; fs_lua=1.1722085376172; fs_uid=#BA8KZ#bdb22d5e-ffca-4333-a3a5-e7048ff2ed3d:23ce5a8a-baa4-4e12-8e33-c94d59c2ac22:1722085308691::3#5868f026#/1753529526; _gat_UA-60854465-1=1; _pxhd=lhLqEsJ0boATSBRqi9rKKygo/y8Qacbxw8h8KsKwzgmsqTLn5o7b6Y1aB0UCAe68yzQxzA7fglMAgKJYwS8Grg; _ga_97DKWJJNRK=GS1.1.1722085313.3.1.1722085444.55.0.0; _ga_PGHC4BDGLM=GS1.1.1722085313.3.1.1722085444.0.0.0',
                'origin': 'https://www.crunchbase.com',
                'priority': 'u=1, i',
                'referer': 'https://www.crunchbase.com/discover/organization.companies?pageId=5_a_392268c3-8e74-6066-7783-9d19f5e80411',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'x-cb-client-app-instance-id': 'faf097f1-4282-461a-8f70-d5018ed211d6',
                'x-requested-with': 'XMLHttpRequest',
                'x-xsrf-token': 'oaPYVNszfs3UuVHBWbehpLK4TVYJMF4CIcwMEkwxwAM'
              }
            }
        );

        return response.data;
    }

    async fetchInvestors(afterId) {
      const body = {
        'field_ids': [
          'identifier',
          'num_investments_funding_rounds',
          'num_exits',
          'location_identifiers',
          'short_description',
          'first_name',
          'last_name',
          'location_group_identifiers',
          'gender',
          'description',
          'num_articles',
          'twitter',
          'facebook',
          'linkedin',
          'primary_job_title',
          'primary_organization',
          'num_founded_organizations',
          'num_portfolio_organizations',
          'num_partner_investments',
          'num_lead_investments',
          'num_diversity_spotlight_investments',
          'num_exits_ipo',
          'num_event_appearances',
          'rank_person',
          'rank_delta_d7',
          'rank_delta_d30',
          'rank_delta_d90',
          'diversity_spotlights',
          'revenue_range',
          'operating_status',
          'founded_on',
          'exited_on',
          'closed_on',
          'company_type',
          'website',
          'contact_email',
          'phone_number',
          'hub_tags',
          'job_posting_link_source',
          'investor_type',
          'investor_stage',
          'program_type',
          'program_application_deadline',
          'program_duration',
          'school_type',
          'school_program',
          'num_enrollments',
          'school_method',
          'num_alumni',
          'category_groups',
          'categories',
          'num_founders',
          'founder_identifiers',
          'num_employees_enum',
          'num_funding_rounds',
          'funding_stage',
          'last_funding_at',
          'last_funding_total',
          'last_funding_type',
          'last_equity_funding_total',
          'last_equity_funding_type',
          'equity_funding_total',
          'funding_total',
          'investor_identifiers',
          'num_lead_investors',
          'num_investors',
          'acquisition_status',
          'ipo_status',
          'went_public_on',
          'delisted_on',
          'ipo_amount_raised',
          'ipo_valuation',
          'stock_symbol',
          'stock_exchange_symbol',
          'rank_org',
          'rank_org_company',
          'rank_org_school'
        ],
        'order': [
          {
            'field_id': 'num_investments_funding_rounds',
            'sort': 'desc'
          }
        ],
        'query': [],
        'field_aggregators': [],
        'collection_id': 'principal.investors',
        'limit': 1000
      };

      if (typeof afterId === 'string') body.after_id = afterId;

      const response = await axios.post(
        'https://www.crunchbase.com/v4/data/searches/principal.investors',
        body,
        {
          params: {
            'source': 'collection_advanced_search'
          },
          headers: {
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cookie': '_gcl_gs=2.1.k1$i1721993485; _gcl_au=1.1.2087770426.1721993489; _gcl_aw=GCL.1721993489.CjwKCAjwko21BhAPEiwAwfaQCCGCEuIWidiW_XO7cair-cHRsycPlo99oVPOhI9w5tU_JJ7GP1yF1xoCKasQAvD_BwE; _mkto_trk=id:976-JJA-800&token:_mch-crunchbase.com-1721993490106-90670; _fbp=fb.1.1721993490274.398673059325807534; cb_analytics_consent=granted; cid=CiiivmajiRdw2gAbLOHXAg==; _ga_4N77WNB622=GS1.1.1721993488.1.0.1721993495.0.0.0; featureFlagOverride=%7B%7D; _pxvid=9e2a6df1-4b42-11ef-8762-f5696836cf12; drift_aid=ed5e8eee-86f7-48d9-952a-3cb67e850deb; driftt_aid=ed5e8eee-86f7-48d9-952a-3cb67e850deb; _hp2_props.973801186=%7B%22Logged%20In%22%3Atrue%2C%22Pro%22%3Atrue%2C%22cbPro%22%3Atrue%7D; _delighted_web={%220SrRdbRV9pdk0Aem%22:{%22_delighted_fst%22:{%22t%22:%221721994044502%22}}}; _hp2_id.973801186=%7B%22userId%22%3A%221008312324497589%22%2C%22pageviewId%22%3A%22194632271860272%22%2C%22sessionId%22%3A%221346779936955745%22%2C%22identity%22%3A%22rushabhcrunchbase2024%40gmail.com%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%7D; xsrf_token=oaPYVNszfs3UuVHBWbehpLK4TVYJMF4CIcwMEkwxwAM; __cf_bm=46EtJtm5K27BiQeGCL50XgU5B2EOXvy7mXkMUB7MLTY-1722433807-1.0.1.1-EhlHKWKdmHF89GvL9weSfoXDm8NwRddskCAV3sADGaK1sPzyyJ1F5DTDQx48Y3l6CMY8DGDZsjLJqxI6TKbWSw; __cflb=02DiuJLCopmWEhtqNz3x2VesGhPn4wGcKSSD6weUiRE4L; pxcts=cd54104e-4f43-11ef-be02-478d701cb718; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jul+31+2024+19%3A20%3A18+GMT%2B0530+(India+Standard+Time)&version=202304.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false; _gid=GA1.2.2095873358.1722433823; _pxhd=8ZQOopU-jLad8MJOExh8f54cf-ruOlY-vzDySdm3y8xhk19Jw1wvUEjPUAHqunzuEPWtVV9MfbbV8ym/ecoDgA; _uetsid=d5a651904f4311ef904487ca236eaca4; _uetvid=9a6be0e04b4211ef9db819c4280afdd8; fs_uid=#BA8KZ#bdb22d5e-ffca-4333-a3a5-e7048ff2ed3d:b577c0e2-cd0a-4930-ad38-97ac276c63d9:1722433824413::1#5868f026#/1753529537; drift_campaign_refresh=2adaad69-0062-4f64-a245-06feb1902489; _ga=GA1.2.1848318772.1721993489; authcookie=eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhNDc3YTVhYi0xZTcwLTRkZGYtYjgxYy1kMDFmNGI1YjgyMmMiLCJpc3MiOiJ1c2Vyc2VydmljZV85N2EzZjVkZF83MzciLCJzdWIiOiI5Y2Q2NzZkNC0zZWZkLTQ1NjUtYmQ2OC05ZmQzZDE1MjQ3MDkiLCJleHAiOjE3MjI0MzQ4MzksImlhdCI6MTcyMjQzNDUzOSwicHJpdmF0ZSI6IlhBbVRTc2V5enVsWjVuRE5BTnlJOTBoQUxkVVRpSUJwSzBlTUFkTWNrdlhsZFVIN29GWDZPY3dDRi8rR0cvVTVQK09OcTRzMjl4emZoNzNnZWE0VDRoVkZYZ0dVTkFuSGY4UVlSKzRtQmJSb0lQc3hFc2pveFVYYmorYnYyNmdVMU9MR2dJMytSNHBTUFFFcjFTQ1dmdW0wWjJMdUdnVXJLcGowQnVEOGh3N3pOL213bWtLU1RLalBBbm05a09ORzZYYjg5aG1QNkVUQThMSlVZNGlvb1JXTWRCQmpGMkEzYkwxU0FpRGFrdFkxUkY2VWxEYmdrdXNudjFkVWVMYVd6bGF0eldIY3Z3TTRVUkhTM1g1Y05aY3FSTXBTSWlIN0R0YjdNNHV2SndTVXZVdWVLRmVSNCt4SEZ5STFMajhnNjBESWkxOVNYa0YyOXc1M0lUcnVPMlduS0pvS250ZFEyUVRqYXRjWkJJS014VVdSL3ZrU3dWd3V3MUx4NCszY2taUWhKSldWcUlUQ1JucFpiZVZmblQxY2hIV1JmZFZIUmM3aEwzMUY2YlY3VkNZcnVodnVNbWdSazVLWm93a0hEeU5ZTllSRlhHM0V1K1hnOTE4Ri94elRXNVBYZEh2VDJWVDhoTytRK0QrNFE0TmRIeDVDeU1xTGt3Rjk3cHp4NTdreTNJYnVKa1AreUg3ajFqYlltK2N1Q1hSbjZGMzhrQkZIL1RqMEpFS2pZL1IzUXgwQmtJSnJPM2FLMWZzVzZhTU9pMGhSWGNKcjZqeFowUzNSQzEvN2x6M3oxT3ZRc2VKUW5hY09pNnVCTDNoVGl2ZVl1dXE3MWhjVjhWbDEyUnRwWTdvV2VZOExzQnJLMWN4TnpoMzA1c3NiWk4yaU5nMGVuc0ljU1ZVK01ZZnRRZzMvN0kvSmVXdTFVUGRtbG1ZdTduMURTeVJveWlERzg2WmZRb08vakxYakZQbytua0tpQXVINWFpaThFQ0JnVTl4a09mT3kzZXU0a29FcmJlT2hlL25FUVJtNURzRlV1UGdTc1pCcUV5NVRNVkVTQjY2MVlYSUxjTmxISGUxa1JtQm90M0lUekFsSmFsNi9NL3NSUFNjLzdOeFV3UmVWRXdZVzRHaldldElmVTkwSEhPU2xYTWxmZ2VvejF6djlCZHc2SFlBUkptTzJ6bWRzZW55TFZWUW1BRmY5TnNkMmNmV3JlWXZBUWo2YmUzdlA3Und5dldSUElIVG1DY0xUaDBpRFBDTTJ5SklndjFXYlhHQ3ovazYxUHhDKysvNzQxTjh4TVBsWU1ncVk5RzdwY2RLYUFGamx6amZ3WXJPU1YzU0JZUVAzZE1XZkFGLytkcE9KODBIUGZETzVYMW8wWjVTWXFQQm90WFFGaEg5L3I5dG9LNTFKK0ZPZ1FzRzZyUGl5MlZjNThBMjVYYjhzOFBNb3U1Nngyb2VubWRHcGJpWFY2STFxdHZ0SER4VlZaaXpsamJHekU5Yz0iLCJwdWJsaWMiOnsic2Vzc2lvbl9oYXNoIjoiMTMwODE2MjAwNiJ9fQ.UPa434DYD7-WHnulLF-WPjihOzpZYOvj48eU6MUXffHVYBV6r_t-lj5byiks7qzJNGZ8g2gloCxdmJocWwaJ1Q; _ga_PGHC4BDGLM=GS1.1.1722433823.7.1.1722434546.0.0.0; _ga_97DKWJJNRK=GS1.1.1722433823.7.1.1722434546.60.0.0; fs_lua=1.1722434570890; _px3=bcdfc0d47fa01287bddce6d8fe04f383d349f062474f03c39df7d1c743dadd20:7RXfx1EoBqLkb3XHJaSV16zInDw0c/lVo+n/DPWicwWH54ByAReGy2NeGCcEGdUbSFun+oyZ3ybHFtEYWnPtIQ==:1000:e9YC0hZ6/XKJjAR8hPLqHvcOaVd44kMpH0+eh6pD17I9N3haP2Yxk7p7xh47HGoOHgPVHL+1Oa2jJxCD00T7QV5rBKUhm8+RtBZoxLIdL+8AYKQnT1IRcdLNZVEri89XhrvyVNSmtoRwbhTMyJEAY/jOXVZj6lhVTNFkBHIbHoiljyFaNZ+JjcNXHPiSmf4Gn6OdIKApPwpTPk4sZrSHDb+cW+sVNnTfhHLa2GHlTNw=; _gat_UA-60854465-1=1',
            'origin': 'https://www.crunchbase.com',
            'priority': 'u=1, i',
            'referer': 'https://www.crunchbase.com/discover/principal.investors/6f1be76bb91cb2b7de94125a03bf81e1?pageId=3_a_ff5d7781-999a-b2f7-097c-5d39998fd021',
            'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'x-cb-client-app-instance-id': '979b5e1f-e1cd-4a61-a7f8-8085b5eb62f9',
            'x-requested-with': 'XMLHttpRequest',
            'x-xsrf-token': 'oaPYVNszfs3UuVHBWbehpLK4TVYJMF4CIcwMEkwxwAM'
          }
        }
      )

      return response.data;
    }

    prepareBulkOperation(companies) {
        const operations = [];

        for (let company of companies) {
            const { uuid } = company;

            operations.push({
                updateOne: {
                    filter: { uuid },
                    update: { $set: company },
                    upsert: true
                }
            });
        }

        return operations;
    }

    async lastCompanyid() {
        const lastCompany = await this.db.collection('companies').find({}).sort({ _id: -1 }).limit(1).toArray();
        debugger;

        const { uuid = true } = lastCompany[0] || {};

        return uuid;
    }

    async lastInvestorid() {
      const lastInvestor = await this.db.collection('investors').find({}).sort({ _id: -1 }).limit(1).toArray();
      debugger;

      const { uuid = true } = lastInvestor[0] || {};

      return uuid;
    }

    async insertCompanies(operations) {
        const data = await this.db.collection('companies').bulkWrite(operations);
        return data;
    }

    async insertInvestors(operations) {
      const data = await this.db.collection('investors').bulkWrite(operations);
      return data;
    }
}

module.exports = Crunchbase;