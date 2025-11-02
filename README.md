## Steps to push code

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
Create a Pull Request from `dev` branch to `uat` branch. Use this [link](https://github.com/Nomora-Dev/Nomora-App/compare/uat...dev) to easily raise a PR. Write this as commit message `many: promote dev to uat` if there are multiple commits.

### 3. Promote to *prod* only from *uat* (for release)
Create a Pull Request from `uat` branch to `prod` branch. Use this [link](https://github.com/Nomora-Dev/Nomora-App/compare/prod...uat) to easily raise a PR. Write this as commit message `many: promote uat to prod` if there are multiple commits.

## Redis
```
sudo dnf install redis
sudo systemctl start redis

sudo systemctl enable redis (For local machine)
sudo systemctl enable /lib/systemd/system/redis-server.service (For Digital Ocean)

redis-cli ping
```
