import config from "@config/config.json";
import Link from "next/link";



import Property from '/components/Property';
import { baseUrl, fetchApi } from '/utils/fetchApi';
import SearchFilters from '/components/SearchFilters';
import noresult from '/assets/images/noresult.svg'

import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { Flex, Box, Text, Icon } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';

const Posts = ({ properties, posts }) => {

  const [searchFilters, setSearchFilters] = useState(false);
  const router = useRouter();

  const { blog_folder, summary_length } = config.settings;
  
  return (
    <div className="section row pb-0">
      <div className="col-12 pb-12 lg:pb-24">
        <div className="row items-center">
        
        
        <Box>
          <Flex
          onClick={() => setSearchFilters((prevFilters)=> !prevFilters)}
          cursor='pointer'
          bg='gray.100'
          borderBottom='1px'
          borderColor='gray.200'
          p='2'
          fontWeight='black'
          fontSize='lg'
          justifyContent='center'
          alignItems='center'
          > 
            <Text>Search Property By Filters</Text>
            <Icon paddingleft='2' w='7' as={BsFilter} />
          </Flex> 


          {searchFilters && <SearchFilters />}
          
          <Flex flexWrap='wrap'>
            
          {[].map((property) => <Property property={property} key={property.id} />)}
          </Flex>
          {[].length === 0 && (
          
          <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
          <Image src={noresult} alt="noresult"/>
          <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
          </Flex>
          )}
       </Box>

      </div>
      </div>
      {posts.slice(1).map((post, i) => (
        <div key={`key-${i}`} className="col-12 mb-8 sm:col-6 lg:col-4">
          {post.frontmatter.image && (
            <Image
              className="rounded-lg"
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              width={i === 0 ? "925" : "445"}
              height={i === 0 ? "475" : "230"}
            />
          )}
          <h2 className="h3 mb-2 mt-4">
            <Link
              href={`/${blog_folder}/${post.slug}`}
              className="block hover:text-primary"
            >
              {post.frontmatter.title}
            </Link>
          </h2>
          <p className="text-text">{post.frontmatter.desc}</p>
          <Link
            className="btn btn-primary mt-4"
            href={`/${blog_folder}/${post.slug}`}
            rel=""
          >
            Read More
          </Link>
        </div>
      ))}
    </div>
  );
};


export async function getServerSideProps({ query }) {
  const purpose = query.purpose || 'for-sale';
  const rentFrequency = query.rentFrequency || 'yearly';
  const minPrice = query.minPrice || '0';
  const maxPrice = query.maxPrice || '1000000';
  const roomsMin = query.roomsMin || '0';
  const bathsMin = query.bathsMin || '0';
  const sort = query.sort || 'price-desc';
  const areaMax = query.areaMax || '35000';
  const locationExternalIDs = query.locationExternalIDs || '5002';
  const categoryExternalID = query.categoryExternalID || '4';

  const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);

  return {
    props: { 
      properties: data?.hits,
    },
  };
}

export default Posts;
