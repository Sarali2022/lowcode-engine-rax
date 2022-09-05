const loadingStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 300,
  fontSize: '24px',
  lineHeight: '36px',
};
import { useState, render } from "rax";
import UniversalDriver from 'driver-universal';
import { buildComponents, assetBundle, AssetLevel, AssetLoader } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-rax-renderer';
const Loading = () => <div style={loadingStyle} className="lowcode-plugin-sample-preview-loading"> <h1>Loading...</h1> </div>;
import { getProjectSchemaFromLocalStorage, getPackagesFromLocalStorage } from './universal/utils';

const getScenarioName = function() {
  if (location.search) {
   return new URLSearchParams(location.search.slice(1)).get('scenarioName') || 'index'
  }
  return 'index';
}

const SamplePreview = () => {
  const [data, setData] = useState({});

  async function init() {
    const scenarioName = getScenarioName();
    const packages = getPackagesFromLocalStorage(scenarioName);
    const projectSchema = getProjectSchemaFromLocalStorage(scenarioName);
    console.log("projectSchema: ", projectSchema);
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    try{
      await assetLoader.load(libraryAsset);
    } catch (e) {
      console.warn('[LowcodePreview] load resources failed: ', e);
    }
    const components = buildComponents(libraryMap, componentsMap);

    setData({
      schema,
      components,
    });
  }

  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Loading />;
  }

  return (
    <div className="lowcode-plugin-sample-preview">
      <ReactRenderer
        className="lowcode-plugin-sample-preview-content"
        schema={schema}
        components={components}
      />
    </div>
  );
};

render(<SamplePreview />, document.getElementById('ice-container'), { driver: UniversalDriver });
