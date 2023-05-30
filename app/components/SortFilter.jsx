import {Disclosure} from '@headlessui/react';
import { Link } from './Link';
import {useEffect, useState} from 'react';
import {useLoaderData} from '@remix-run/react';

export function SortMenu() {
  return (
    <div className="sort-wrap">
       
    </div>
  )
}

export function Filter({filters = []}) {

  function onChange(e) {
    console.log(e.target.value);
    let type = e.target.value.toLowerCase().replace(/ /g,'-');
    // fetchProductsByType(type)
  }
 
  // // Inside your component or function
  // fetchProductsByType = async (type) => {
    
  //   try {
  //     const { data } = await client.query({
  //       query: gql(GET_PRODUCTS_BY_TYPE),
  //       variables: { type },
  //     });

  //     // Handle the retrieved data, e.g., update state, display results, etc.
  //     console.log(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const filterMarkup = (filter, option) => {

    switch (filter.type) {
      case 'PRICE_RANGE':
        const min =
          params.has('minPrice') && !isNaN(Number(params.get('minPrice')))
            ? Number(params.get('minPrice'))
            : undefined;

        const max =
          params.has('maxPrice') && !isNaN(Number(params.get('maxPrice')))
            ? Number(params.get('maxPrice'))
            : undefined;

        return <PriceRangeFilter min={min} max={max} />;

      default:
        return (
          <>
          <input type='radio' onChange={onChange} name={filter.id} id={option.id} value={option.label}/>
          <label for={option.id}> {option.label} </label>
          </>
        )
    }
  };
  
  return (
    <div className="filter-wrap">
      <div className="divide-y">
        {filters.map(
          (filter) =>
            filter.values.length > 1 && (
              <Disclosure as="div" key={filter.id} className="w-full">
                {({open}) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full py-4">
                      <span size="lead">{filter.label}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel key={filter.id}>
                      <ul key={filter.id} className="py-2">
                        {filter.values?.map((option) => {
                          return (
                            <li key={option.id} className="pb-4">
                              {filterMarkup(filter, option)}
                            </li>
                          );
                        })}
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ),
        )}
      </div>
    </div>
  )
}
