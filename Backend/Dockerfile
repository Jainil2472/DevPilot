FROM 26.11.1-alpine3.23

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* tsconfig.json ./

RUN pnpm install

COPY . . 

EXPOSE 8000

CMD [ "pnpm", "dev" ]