## Products API - Checklist

---

### 1. Create Product

#### 1.1. Successful creation

1.1.1. Create product with fully valid data → **201 Created**, schema matches, response equals input (except `_id`, `createdOn`)

#### 1.2. "name" field validation

##### Valid cases:

1.2.1. Name length = **3** characters → success  
1.2.2. Name length = **40** characters → success  
1.2.3. Name contains **a single space** → success

##### Invalid cases:

1.2.4. Name length = **2** → 400  
1.2.5. Name length = **41** → 400  
1.2.6. Name contains **double space** → 400  
1.2.7. Name contains **special characters** (@#$%) → 400  
1.2.8. Name field missing → 400  
1.2.9. Name is an empty string → 400  
1.2.10. Name is not a string (e.g., `123`) → 400

---

#### 1.3. "price" field validation

##### Valid cases:

1.3.1. Price = **1** → success  
1.3.2. Price = **99999** → success

##### Invalid cases:

1.3.3. Price = **0** → 400  
1.3.4. Price = **100000** → 400  
1.3.5. Price is negative → 400  
1.3.6. Price is not a number (string) → 400  
1.3.7. Price field missing → 400

---

#### 1.4. "amount" field validation

##### Valid cases:

1.4.1. Amount = **0** → success  
1.4.2. Amount = **999** → success

##### Invalid cases:

1.4.3. Amount negative → 400  
1.4.4. Amount = **1000** → 400  
1.4.5. Amount is not a number (string) → 400  
1.4.6. Amount field missing → 400

---

#### 1.5. "notes" field validation

##### Valid cases:

1.5.1. Notes length = **250** characters → success  
1.5.2. Notes field missing → success  
1.5.3. Notes is an empty string → success

##### Invalid cases:

1.5.4. Notes length = **251** characters → 400  
1.5.5. Notes contain `<` or `>` → 400

---

### 2. Delete Product

#### 2.1. Successful deletion

2.1.1. Delete product with valid existing `id` → **200 OK**

#### 2.2. Invalid "id" values

2.2.1. Non-existing `id` → **404 Not Found**  
2.2.2. Invalid `id` format → **400 Bad Request**  
2.2.3. Empty `id` → **400 Bad Request**  
2.2.4. Missing `id` in URL → **404/400**  
2.2.5. Wrong `id` type (number, boolean, array) → **400**

#### 2.3. Authorization

2.3.1. Delete without token → **401 Unauthorized**  
2.3.2. Delete with invalid/expired token → **401 Unauthorized**  
2.3.3. Delete with insufficient permissions → **403 Forbidden**

#### 2.4. Idempotency

2.4.1. Delete the same product twice → second attempt → **404 Not Found**

---

### 3. Get All Products

#### 3.1. Positive

3.1.1. Valid token → **200 OK**  
3.1.2. Response matches schema  
3.1.3. `Products` is an array  
3.1.4. `Products.length > 0`

#### 3.2. Negative

3.2.1. Empty token → **401 Unauthorized**  
3.2.2. Invalid token → **401 Unauthorized**

---

### 4. Get Product By Id

#### 4.1. Positive

4.1.1. Valid token + existing product ID → **200 OK**  
4.1.2. Response matches schema  
4.1.3. Returned product equals created product

#### 4.2. Negative

4.2.1. Empty token → **401 Unauthorized**  
4.2.2. Invalid token → **401 Unauthorized**  
4.2.3. Non-existent product ID → **404 Not Found**

---

### 5. Update Product

#### 5.1. Positive

5.1.1. Valid token + existing product ID + valid update data → **200 OK**  
5.1.2. Response matches schema  
5.1.3. Updated product keeps same `_id`

#### 5.2. Negative

5.2.1. Empty token → **401 Unauthorized**  
5.2.2. Invalid token → **401 Unauthorized**  
5.2.3. Duplicate product name → **409 Conflict**  
5.2.4. Non-existent product ID → **404 Not Found**
