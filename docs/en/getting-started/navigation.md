# Programmatic Navigation and History Manipulation

Aside from using `<router-link>` to create anchor tags for declarative navigation, we can do this programmatically using vue-router's APIs.

#### router.push
It pushes a new entry to the history record. This is the method called internally when you click a `<router-link>`, so clicking `<router-link :to="...">` is the equivalent of calling `router.push(...)`. 

| Declarative | Programmatic |
|-------------|--------------|
| `<router-link :to="...">` | `router.push(...)` |

Examples: 
``` js
// literal string
router.push('home')

// object
router.push({ path: 'home' })

// named route
router.push({ name: 'user', params: { userId: 123 }})

// with query, resulting in /register?plan=private 
router.push({ path: 'register', query: { plan: 'private' }})
```

#### router.replace
It acts like `router.go`, the only difference is that it navigates without creating a new history record, as its name suggests - it replaces current history record.

| Declarative | Programmatic |
|-------------|--------------|
| `<router-link :to="..." replace>` | `router.replace(...)` |


#### router.go
It takes a single integer as parameter that indicates by how many history records to go forwards or go backwards. In router's `history` and `abstract` mode, `router.go` is actually an alias to `window.history.go`, so you can read more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/History).

Examples

``` js
// go forward by one record, the same as history.forward()
router.go(1)

// go back by one record, the same as history.back()
router.go(-1)

// go forward by 3 records
router.go(3)

// fails silently if there aren't that many records.
router.go(-100)
router.go(100)
```


#### History Manipulation

You may have noticed that `router.push`, `router.replace` and `router.go` are counterparts of [`window.history.pushState`, `window.history.replaceState` and `window.history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History), and they do imitate the `window.history` APIs.

Therefore, if you are already familiar with [Browser History APIs](https://developer.mozilla.org/en-US/docs/Web/API/History_API), manipulating history will be super easy with vue-router.

It is worth mentioning that vue-router APIs (`push`, `replace`, `go`) works consistently under all router modes (`history`, `hash` and `abstract`). Below is a table to give you a quick glance at how vue-router achieves it.

| Router API     | Called under the hood |                       |                    |
|----------------|-----------------------|-----------------------|--------------------|
|                | `history` mode        | `hash` mode           | `abstract` mode    |
| router.push    | history.pushState     | location.hash = ...   | own implementation |
| router.replace | history.replaceState  | location.replace      | own implementation |
| router.go      | history.go            | history.go            | own implementation | 
