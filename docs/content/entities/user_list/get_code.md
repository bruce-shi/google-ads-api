---
title: Get UserList
order: 2.1
type: get_code
entity: UserList
---

```javascript
// Getting the entity
let result = await customer.userLists.get('customers/3827277046/userLists/509186086')
```

```javascript
// Example result
;({
  access_reason: 2,
  account_user_list_status: 2,
  description: 'Combined audience based on available data sources',
  eligible_for_display: true,
  eligible_for_search: true,
  id: 509186086,
  logical_user_list: {
    rules: [
      {
        operator: 3,
        ruleOperandsList: [
          { userList: { value: 'customers/3827277046/userLists/508846109' } },
          { userList: { value: 'customers/3827277046/userLists/614318739' } },
        ],
      },
    ],
  },
  membership_life_span: 30,
  membership_status: 2,
  name: 'My user list',
  read_only: true,
  resource_name: 'customers/3827277046/userLists/509186086',
  size_for_display: 8,
  size_for_search: 16,
  size_range_for_display: 2,
  size_range_for_search: 2,
  type: 3,
})
```
