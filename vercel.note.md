# Desenvolvimento Local

```json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }]
}
```

# Produção

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
