# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img
        - generic [ref=e7]: Sales Portal
      - link "Home" [ref=e9] [cursor=pointer]:
        - /url: "#/home"
      - link "Orders" [ref=e11] [cursor=pointer]:
        - /url: "#/orders"
      - link "Products" [ref=e13] [cursor=pointer]:
        - /url: "#/products"
      - link "Customers" [ref=e15] [cursor=pointer]:
        - /url: "#/customers"
      - link "Managers" [ref=e17] [cursor=pointer]:
        - /url: "#/managers"
    - generic [ref=e19]:
      - button " 5" [ref=e21] [cursor=pointer]:
        - generic: 
        - generic [ref=e22]: "5"
      - button "" [ref=e23] [cursor=pointer]:
        - generic: 
      - link "User" [ref=e25] [cursor=pointer]:
        - /url: "#/managers/undefined"
        - strong [ref=e26]: User
      - button "" [ref=e27] [cursor=pointer]:
        - generic: 
  - generic [ref=e30]:
    - heading "Connection failed" [level=1] [ref=e31]
    - paragraph [ref=e32]: Opps! Something went wrong.
    - paragraph [ref=e33]: Can't reach the data. Please, try again later.
    - link "Back to Home" [ref=e34] [cursor=pointer]:
      - /url: "#/home"
```