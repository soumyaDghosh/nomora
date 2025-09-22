# Nomora App

## Steps to Push

NOTE: *dev* is default branch for any new code.

### 1. Develop features in *dev*
```
git checkout dev
git pull origin dev

# work on feature
git add .
git commit -m "your commit message"
git push origin dev
```

### 2. Promote to *uat* (for testing)
```
git checkout uat
git pull origin uat

# bring latest dev into uat
git merge dev

git push origin uat
```

### 3. Switch to *dev* after pushing to *uat*
```
git checkout dev
git pull origin dev
```

### 4. Promote to *prod* only from *uat* (for release)
```
git checkout prod
git pull origin prod

# bring tested code into prod
git merge uat

git push origin prod

# change branch back to dev
git checkout dev
git pull origin dev
```

## Redis
```
sudo dnf install redis
sudo systemctl start redis

sudo systemctl enable redis (For local machine)
sudo systemctl enable /lib/systemd/system/redis-server.service (For Digital Ocean)

redis-cli ping
```