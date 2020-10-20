# code-appsearch
This is a short walkthrough to set up an [Elastic App Search](https://www.elastic.co/guide/en/app-search/current/index.html) instance and UI for searching through text/source code files.  This set up will assume that there is a collection of source code files on a filesystem that Logstash will attempt to collect and send to App Search for indexing.  The React-based library, [search-ui](https://github.com/elastic/search-ui), will be used to create a feature-rich web-based search UI that can be easily customized.

## App Search Setup
Download and install Elastic Enterprise Search / App Search for a [self-managed install](https://www.elastic.co/downloads/enterprise-search) or spin up an instance using our hosted [Elastic Cloud](https://www.elastic.co/blog/elastic-enterprise-search-now-available-on-elastic-cloud).  Please note that for a self-managed install, the Elastic Enterprise Search endpoint must be accessible from both the Logstash host and the host with the search-ui components.  [Create an engine](https://www.elastic.co/guide/en/app-search/current/getting-started.html#getting-started-with-app-search-engine) that will host the soure code files and [create a private key](https://www.elastic.co/guide/en/app-search/current/authentication.html#authentication) that has permissions to write to the engine that was created.  Also create a public search key that will be used by search-ui to query App Search.  Record the App Search endpoint URL, the engine name, and both the private API key and public search API key.

## Logstash Setup
[Install Logstash](https://www.elastic.co/guide/en/logstash/current/getting-started-with-logstash.html) on a host that has filesystem access to the source code repository and can reach the Elastic App Search endpoint.  You may also need to install or update the App Search output plugin for Logstash:
```
bin/logstash-plugin install logstash-output-elastic_app_search
```
or
```
bin/logstash-plugin update 
bin/logstash-plugin update logstash-output-elastic_app_search
```
Modify the [Logstash config file](logstash/full_file.conf) in the following locations:
- input->file->path should point to the top level directory of your source code repository
```
input {
        file {
                ...
                path => "/your/code/top-level/dir/**/*.*"
```
- output->elastic_app_search configuration should point to your Elastic App Search install and use the private writeable API key for the engine that you created earlier.
```
output {
        elastic_app_search {
                url => "https://your.url"
                engine => "your-engine-name"
                api_key => "private-writeable-key-to-engine"
```
- (Optional) filter->if [file extension] clause can be updated to include additional file extensions that you do not want to index into App Search
```
filter {
        ...
        # Ignore files with these extensions
        if [file_extension] in ["png", "jpg", "jpg", "gif"] {
                drop { }
        }
```
Additional metadata fields can be created in the filter clause, if desired. 
## Search-ui Setup
### Prerequisites
Search-ui is a library of [React](https://reactjs.org/) components and requires that [Node.js/npm be installed](https://www.npmjs.com/get-npm).  The host that will run these web-based components needs access to the App Search endpoint and must also be rearchable by any users who want to leverage the application (default port is 3000).  

### Installation and Deployment
Once `npm` is installed, run the following commands to create a React project (feel free to use a different name instead of code-app-search):
```
npm install -g create-react-app
create-react-app code-app-search --use-npm
cd code-app-search
```
Next, install the Elastic Search-ui libraries:
```
npm install --save @elastic/react-search-ui @elastic/search-ui-app-search-connector
```
There should be a `src/App.js` file in your generated code-app-search project.  Replace the generated file with the [App.js](appsearch/App.js) from this repo.  Update the values for `searchKey` (public search key), `engineName`, and `endpointBase` (App Search endpoint URL) in [App.js](appsearch/App.js):
```
const connector = new AppSearchAPIConnector({
	searchKey: "your-search-key",
	engineName: "your-engine-name",
	//hostIdentifier: "your-host-id.ent-search.us-west1.gcp.cloud.es.io"
	endpointBase: "https://your-endpoint.ent-search.us-west1.gcp.cloud.es.io"
```
Finally, start the app in development mode:
```
npm start
```
You should have a working search box with autocomplete and filtering capabilities.  Please see this [blog post](https://www.elastic.co/blog/how-to-build-great-react-search-experiences-quickly?baymax=elastic-web&elektra=blog&rogue=searchui-ga-announcement) for more information on how to customize and extend the UI.