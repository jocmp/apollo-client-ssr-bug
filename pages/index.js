import { gql, useQuery } from "@apollo/client";
import App from "../components/App";
import { initializeApollo, addApolloState } from "../lib/apolloClient";

const ListingSearchQuery = gql`
  query ListingsSearch($input: Input_reverb_search_ListingsSearchRequest) {
    listingsSearch(input: $input) {
      listings {
        id
        title
        pricing {
          buyerPrice {
            display
          }
        }
      }
    }
  }
`;

const SSRPage = () => {
  const { data } = useQuery(ListingSearchQuery, {
    variables: {
      input: {
        shopId: "2",
        acceptsOffers: true,
        conditionSlugs: ["mint"],
        limit: 5,
      }
    }
  });
  return (
    <App>
      {data.listingsSearch.listings.map((listing) => (
        <>
          <div key={listing.id}>
            <p>
              {listing.title}
            </p>
            <p>
              {listing.pricing.buyerPrice.display}
            </p>
          </div>
          <hr />
        </>
      ))}
    </App>
  );
};

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ListingSearchQuery,
    variables: {
      input: {
        acceptsOffers: true,
        shopId: "2",
        conditionSlugs: ["mint"],
        limit: 5,
      }
    }
  });
  return addApolloState(apolloClient, {
    props: {},
  });
}

export default SSRPage;
