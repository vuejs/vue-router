# Route

The Route type defines a route manipulated by the router. This is different from [RouteConfig](route-config.md)

## Flow definition

``` flow
declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: StringHash;
  params: StringHash;
  fullPath: string;
  matched: Array<RouteRecord>;
  redirectedFrom?: string;
  meta?: any;
}
```
