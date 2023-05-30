import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {ProductCard} from './ProductCard';
import {Disclosure} from '@headlessui/react';

export function ProductGrid({collection, url}) {

  const [nextPage, setNextPage] = useState(collection.products.pageInfo.hasNextPage);
  const [endCursor, setEndCursor] = useState(collection.products.pageInfo.endCursor);
	const [products, setProducts] = useState(collection.products.nodes || []);

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    fetcher.load(`${url}?index&cursor=${endCursor}`);
  }

  useEffect(() => {
    if (!fetcher.data) return;
    const {collection} = fetcher.data;

    setProducts((prev) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
    
  }, [fetcher.data]);

  // Filter state
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
    
  // Apply filters
  const filteredProducts = products.filter((product) => {
    const typeMatch = selectedType === '' || product.productType === selectedType;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => product.tags.includes(tag));
    return typeMatch && tagMatch;
  });
  

  // Event handlers for filters
  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const handleTagFilter = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      }
      return [...prevTags, tag];
    });
  };

  return (
    
    <div className="w-full flex">
      <div className='sidebar'>
        <Filter handleTypeFilter={handleTypeFilter} handleTagFilter={handleTagFilter} filters={collection.products.filters}></Filter>
      </div>

      <div className="content flex-1">
        <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-3 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))} 
        </div>
        
        {nextPage && (
          <div className="flex items-center justify-center mb-8 mt-6">
            <button 
              disabled={fetcher.state !== 'idle'}
              onClick={fetchMoreProducts}
              className="btn-secondary cursor-pointer">
              {fetcher.state !== 'idle' ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
       </div>
    </div>
  );
}

function Filter({handleTypeFilter, handleTagFilter, filters}) {
  return (
    <div className="filter-wrap">
      <div className="divide-y">
        {filters.map(
          (filter) =>
            filter.values.length > 1 && (
              <Disclosure as="div" key={filter.id}>
                <Disclosure.Button className="flex justify-between w-full py-4">
                  <span size="lead">{filter.label}</span>
                </Disclosure.Button>
                <Disclosure.Panel key={filter.id}>
                  <ul key={filter.id} className="py-2">
                    {filter.values?.map((option) => {
                      let filterID = filter.id;
                      return (
                        <li key={option.id} className="pb-4">
                          {filterID == "filter.p.product_type" ? (
                            <input type='radio' onChange={(e) => handleTypeFilter(e.target.value)} name={filter.id} id={option.id} value={option.label}/>
                          ) : filterID == "filter.p.tag" ?(
                            <input type='radio' onChange={(e) => handleTagFilter(e.target.value)}
                            name={filter.id} id={option.id} value={option.label}/>
                          ): ''}
                     
                          <label htmlFor={option.id}> {option.label} </label>
                        </li>
                      );
                    })}
                  </ul>
                </Disclosure.Panel>
              </Disclosure>
            ),
        )}
      </div>
    </div>
  )
}

export function CollectionTemplate({collection}) {
  return (
    <ProductGrid
        collection={collection}
        url={`/collections/${collection.handle}`}
      />
  )
}