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
      - link "Bill" [ref=e25] [cursor=pointer]:
        - /url: "#/managers/692337ce1c508c5d5e95335d"
        - strong [ref=e26]: Bill
      - button "" [ref=e27] [cursor=pointer]:
        - generic: 
  - generic [ref=e29]:
    - img "Sad face" [ref=e30]
    - heading "404" [level=1] [ref=e31]
    - paragraph [ref=e32]: Oops! Page not found.
    - paragraph [ref=e33]:
      - text: "We couldn't find a page for:"
      - code [ref=e34]: "#//orders"
    - link "Back to Home" [ref=e35] [cursor=pointer]:
      - /url: "#/home"
```