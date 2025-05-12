## CBCT Guide
### Prerequisite
```
npm install -g pnpm
```

### Dependency installation
```
pnpm install
```

### Run dev server
```
pnpm run dev
```

### Compile typescript
```
pnpm run build
```

### Run production server
```
pnpm start
```

### Build docker image
```
// asset-provider-domain: CDN domain for serving assets
// auth-store-encryption-key: encryption key for auth store
pnpm run docker:build <asset-provider-domain> <auth-store-encryption-key>
```
