import React from 'react';
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, Results, SearchBox, PagingInfo, ResultsPerPage, Paging, Facet, Sorting, Result } from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import { Result as ResultView } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

const connector = new AppSearchAPIConnector({
	searchKey: "your-search-key",
	engineName: "your-engine-name",
	//hostIdentifier: "your-host-id.ent-search.us-west1.gcp.cloud.es.io"
	endpointBase: "https://your-endpoint.ent-search.us-west1.gcp.cloud.es.io"
});

const configurationOptions = {
	apiConnector: connector,
	autocompleteQuery: {
		suggestions: {
			types: {
				documents: {
					fields: ["filename"]
				}
			},
			size: 5
		}
	},
	searchQuery: {
		search_fields: {
			message: {}
		},
		result_fields: {
			filename: {
				// A snippet means that matching search terms will be wrapped in <em> tags.
				snippet: {
					size: 75, // Limit the snippet to 75 characters.
					fallback: true // Fallback to a "raw" result.
				}
			},
			fullpath: {
				// A snippet means that matching search terms will be wrapped in <em> tags.
				snippet: {
					size: 75, // Limit the snippet to 75 characters.
					fallback: true // Fallback to a "raw" result.
				}
			},
			parent_directory: {
				// A snippet means that matching search terms will be wrapped in <em> tags.
				snippet: {
					size: 75, // Limit the snippet to 75 characters.
					fallback: true // Fallback to a "raw" result.
				}
			},
			project_name: {
				// A snippet means that matching search terms will be wrapped in <em> tags.
				snippet: {
					size: 75, // Limit the snippet to 75 characters.
					fallback: true // Fallback to a "raw" result.
				}
			},
			message: {
				// A snippet means that matching search terms will be wrapped in <em> tags.
				snippet: {
					size: 1000, // Limit the snippet to 75 characters.
					fallback: true // Fallback to a "raw" result.
				}
			}
		},
		facets: {
			file_extension: { type: "value", size: 100 },
			parent_directory: { type: "value", size: 100 },
			project_name: { type: "value", size: 100 },
			host: { type: "value", size: 100 }
		}
	}
};


export default function App() {
	return (
		<SearchProvider config={configurationOptions}>
			<div className="App">
				<Layout
					header={<SearchBox autocompleteSuggestions={true} />}
					// titleField is the most prominent field within a result: the result header.
					bodyContent={<Results titleField="filename" />}
					sideContent={
						<div>
							<Sorting
								label={"Sort by"}
								sortOptions={[
									{
										name: "Relevance",
										value: "",
										direction: ""
									},
									{
										name: "Name",
										value: "filename",
										direction: "asc"
									}
								]}
							/>
							// Filter fields
							<Facet field="file_extension" label="File Extension" isFilterable={true} />
							<Facet field="parent_directory" label="Parent Directory" isFilterable={true} />
							<Facet field="project_name" label="Project" isFilterable={true} />
							<Facet field="host" label="Host" isFilterable={true} />
						</div>
					} 
 					bodyHeader={
						<>
							<PagingInfo />
							<ResultsPerPage />
						</>
					}
					bodyFooter={<Paging />}
				/>
			</div>
		</SearchProvider>
	);
}

