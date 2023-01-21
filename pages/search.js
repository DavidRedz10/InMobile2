import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Cta from "@layouts/components/Cta";
import Button from "@layouts/shortcodes/Button";
import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { getListPage } from "../lib/contentParser";
import SearchFilters from '/components/SearchFilters';
import { Flex, Box, Text, Icon, ChakraProvider } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

import { baseUrl, fetchApi } from '../utils/fetchApi';
import Property from '../components/Property';

const Search = ({ properties , frontmatter, propertiesForSale, propertiesForRent }) => {
  const { banner, feature, services, workflow, call_to_action } = frontmatter;
  const { title } = config.site;
  const [searchFilters, setSearchFilters] = useState(false);
  const router = useRouter();

  return (
    <Base justifyContent="center" alignContent="center">
      {/* Banner */}
      
      <section justifyContent="center" alignContent="center">
      <Box justifyContent="center" alignContent="center" paddingTop="1cm">
        <ChakraProvider>
      <Flex
        onClick={() => setSearchFilters(!searchFilters)}
        paddingTop="1cm"
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
      <Flex paddingTop="1cm" flexWrap='wrap' justifyContent="center" alignContent="center">
        
        {properties.map((property) => <Property property={property} key={property.id} />)}
        
      </Flex>
      </ChakraProvider>
      {properties.length === 0 && (
        <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
          <Image src={noresult} alt="noresult"/>
          <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
        </Flex>     
      )}
    </Box>
    </section>
    </Base>
  );
};



export async function getServerSideProps({ query }) {

const homePage = await getListPage("content/_index.md");
const { frontmatter } = homePage;
  
  const propertyForSale = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-sale&hitsPerPage=6`);
  const propertyForRent = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-rent&hitsPerPage=6`);

    
    const purpose = query.purpose || 'for-rent';
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
        frontmatter,
        propertiesForSale: propertyForSale?.hits,
        propertiesForRent: propertyForRent?.hits,
      },
    };
  }
  
  export default Search;
  



