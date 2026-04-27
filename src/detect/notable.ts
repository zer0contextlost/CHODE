export const NOTABLE_JS = new Set([
  'react', 'vue', 'svelte', 'next', 'nuxt', 'astro', 'remix',
  'express', 'fastify', 'hono', 'koa', '@nestjs/core',
  'prisma', 'drizzle-orm', 'typeorm', 'mongoose',
  'zod', 'valibot', 'yup',
  'tailwindcss', 'stripe', 'redis', 'bullmq',
  'bun', 'vite', 'vitest', 'jest', 'playwright', 'mocha', 'supertest',
]);

export const GO_HTTP_ROUTERS = new Set(['gin', 'echo', 'fiber', 'chi', 'mux']);

export const NOTABLE_GO = new Map<string, string>([
  ['github.com/gin-gonic/gin', 'gin'],
  ['github.com/labstack/echo', 'echo'],
  ['github.com/gofiber/fiber', 'fiber'],
  ['github.com/go-chi/chi', 'chi'],
  ['github.com/gorilla/mux', 'mux'],
  ['github.com/spf13/cobra', 'cobra'],
  ['github.com/spf13/viper', 'viper'],
  ['github.com/urfave/cli', 'cli'],
  ['gorm.io/gorm', 'gorm'],
  ['entgo.io/ent', 'ent'],
  ['github.com/jackc/pgx', 'pgx'],
  ['github.com/lib/pq', 'pq'],
  ['github.com/go-sql-driver/mysql', 'mysql'],
  ['github.com/mattn/go-sqlite3', 'sqlite3'],
  ['github.com/sqlc-dev/sqlc', 'sqlc'],
  ['github.com/redis/go-redis', 'redis'],
  ['github.com/go-redis/redis', 'redis'],
  ['google.golang.org/grpc', 'grpc'],
  ['github.com/grpc-ecosystem/grpc-gateway', 'grpc-gateway'],
  ['go.uber.org/fx', 'fx'],
  ['github.com/google/wire', 'wire'],
  ['go.uber.org/zap', 'zap'],
  ['github.com/rs/zerolog', 'zerolog'],
  ['github.com/sirupsen/logrus', 'logrus'],
  ['github.com/golang-jwt/jwt', 'jwt'],
  ['github.com/cli/oauth', 'oauth'],
  ['golang.org/x/oauth2', 'oauth2'],
  ['go.opentelemetry.io/otel', 'otel'],
  ['github.com/stretchr/testify', 'testify'],
  ['github.com/onsi/ginkgo', 'ginkgo'],
  ['github.com/pressly/goose', 'goose'],
  ['github.com/charmbracelet/bubbletea', 'bubbletea'],
  ['github.com/denisenkom/go-mssqldb', 'mssql'],
  ['github.com/microsoft/go-mssqldb', 'mssql'],
]);

export const NOTABLE_RUST = new Set([
  'tokio', 'axum', 'actix-web', 'actix', 'warp', 'hyper', 'tower', 'reqwest',
  'rocket', 'poem', 'tide', 'salvo',
  'serde', 'serde_json',
  'diesel', 'sqlx', 'sea-orm', 'rusqlite',
  'clap', 'structopt',
  'anyhow', 'thiserror',
  'tracing', 'log', 'env_logger',
  'tonic', 'prost',
  'redis', 'mongodb',
  'jsonwebtoken', 'oauth2',
  'rayon', 'tokio-rayon',
]);

export const NOTABLE_DART = new Set([
  'riverpod', 'provider', 'bloc', 'flutter_bloc', 'get', 'getx',
  'dio', 'http', 'retrofit',
  'go_router', 'auto_route',
  'hive', 'isar', 'sqflite', 'drift',
  'firebase_core', 'cloud_firestore', 'firebase_auth',
  'freezed', 'json_serializable', 'equatable',
  'mockito', 'mocktail',
]);

export const NOTABLE_SCALA = new Set([
  'akka', 'akka-http', 'akka-stream', 'pekko',
  'http4s', 'tapir', 'zio', 'cats-effect', 'cats',
  'slick', 'doobie', 'quill',
  'circe', 'play-json', 'spray-json',
  'play', 'scalatra',
  'scalatest', 'specs2', 'munit',
  'fs2', 'monix',
]);

export const NOTABLE_SWIFT = new Set([
  'vapor', 'hummingbird', 'perfect',
  'SwiftNIO', 'AsyncHTTPClient',
  'Alamofire', 'Moya',
  'Combine', 'RxSwift',
  'GRDB', 'SQLite.swift', 'CoreData',
  'SnapKit', 'Kingfisher',
  'XCTest', 'Quick', 'Nimble',
  'SwiftUI', 'UIKit',
]);

export const NOTABLE_KOTLIN = new Set([
  'ktor', 'spring-boot', 'exposed', 'koin', 'kodein',
  'kotlinx-coroutines', 'kotlinx-serialization', 'arrow',
  'mockk', 'kotest', 'junit',
  'retrofit', 'okhttp', 'fuel',
]);

export const NOTABLE_ELIXIR = new Set([
  'phoenix', 'plug', 'ecto', 'absinthe', 'oban',
  'ex_unit', 'mox', 'bypass',
  'gettext', 'timex', 'jason', 'poison',
  'comeonin', 'bcrypt_elixir', 'guardian',
  'broadway', 'gen_stage', 'flow',
  'telemetry', 'opentelemetry',
]);

export const NOTABLE_CSHARP = new Set([
  'Microsoft.AspNetCore', 'Microsoft.EntityFrameworkCore',
  'Dapper', 'MediatR', 'AutoMapper',
  'Serilog', 'NLog', 'Microsoft.Extensions.Logging',
  'xunit', 'NUnit', 'Moq', 'FluentAssertions',
  'Newtonsoft.Json', 'System.Text.Json',
  'Swashbuckle', 'NSwag',
  'MassTransit', 'Hangfire', 'Quartz',
  'IdentityServer', 'Duende',
  'FluentValidation', 'Ardalis', 'Blazored', 'Polly',
]);

export const NOTABLE_PHP = new Set([
  'laravel', 'symfony', 'lumen', 'slim', 'laminas',
  'eloquent', 'doctrine', 'phinx',
  'guzzlehttp', 'pest', 'phpunit',
  'livewire', 'inertiajs', 'filament',
  'sanctum', 'passport', 'jwt-auth',
  'queue', 'horizon', 'telescope', 'octane',
]);

export const NOTABLE_JAVA = new Map<string, string>([
  ['org.springframework.boot', 'spring-boot'],
  ['org.springframework', 'spring'],
  ['io.quarkus', 'quarkus'],
  ['io.micronaut', 'micronaut'],
  ['com.vaadin', 'vaadin'],
  ['org.hibernate', 'hibernate'],
  ['jakarta.persistence', 'jpa'],
  ['org.mybatis', 'mybatis'],
  ['io.vertx', 'vertx'],
  ['org.apache.kafka', 'kafka'],
  ['io.grpc', 'grpc'],
  ['org.projectlombok', 'lombok'],
  ['io.jsonwebtoken', 'jwt'],
  ['junit', 'junit'],
  ['org.mockito', 'mockito'],
]);

export const NOTABLE_RUBY = new Set([
  'rails', 'sinatra', 'hanami', 'roda', 'grape', 'padrino',
  'activerecord', 'sequel', 'rom-rb',
  'sidekiq', 'resque', 'delayed_job',
  'devise', 'doorkeeper', 'pundit', 'cancancan',
  'graphql-ruby', 'grape-entity',
  'rspec', 'minitest', 'cucumber',
  'puma', 'unicorn', 'thin',
  'redis', 'mongoid', 'elasticsearch-model',
  'httparty', 'faraday', 'rest-client',
  'jwt', 'bcrypt',
  'dry-rb', 'trailblazer',
]);

export const NOTABLE_PYTHON = new Set([
  'fastapi', 'django', 'flask', 'starlette', 'tornado', 'sanic', 'litestar',
  'pydantic', 'marshmallow',
  'sqlalchemy', 'alembic', 'tortoise-orm', 'databases',
  'celery', 'dramatiq', 'rq', 'arq',
  'uvicorn', 'gunicorn', 'hypercorn', 'daphne',
  'httpx', 'requests', 'aiohttp',
  'redis', 'pymongo', 'motor', 'elasticsearch',
  'typer', 'click',
  'anthropic', 'openai', 'langchain',
  'numpy', 'pandas', 'scikit-learn', 'torch', 'tensorflow',
  'boto3', 'pytest',
]);

export const EXT_SERVICES_GO = new Map<string, string>([
  ['github.com/stripe/stripe-go', 'stripe'],
  ['github.com/aws/aws-sdk-go', 'aws'],
  ['github.com/aws/aws-sdk-go-v2', 'aws'],
  ['cloud.google.com/go', 'gcp'],
  ['github.com/Azure/azure-sdk-for-go', 'azure'],
  ['github.com/elastic/go-elasticsearch', 'elasticsearch'],
  ['go.mongodb.org/mongo-driver', 'mongodb'],
  ['github.com/slack-go/slack', 'slack'],
  ['github.com/google/go-github', 'github-api'],
  ['github.com/sendgrid/sendgrid-go', 'sendgrid'],
  ['github.com/twilio/twilio-go', 'twilio'],
  ['github.com/mailgun/mailgun-go', 'mailgun'],
  ['github.com/prometheus/client_golang', 'prometheus'],
  ['github.com/minio/minio-go', 'minio'],
  ['github.com/opensearch-project/opensearch-go', 'opensearch'],
  ['firebase.google.com/go', 'firebase'],
  ['github.com/sashabaranov/go-openai', 'openai'],
  ['github.com/anthropics/anthropic-sdk-go', 'anthropic'],
]);

export const EXT_SERVICES_JS = new Map<string, string>([
  ['stripe', 'stripe'],
  ['@stripe/stripe-js', 'stripe'],
  ['aws-sdk', 'aws'],
  ['@google-cloud', 'gcp'],
  ['@elastic/elasticsearch', 'elasticsearch'],
  ['mongodb', 'mongodb'],
  ['@sendgrid/mail', 'sendgrid'],
  ['twilio', 'twilio'],
  ['@slack/web-api', 'slack'],
  ['@slack/bolt', 'slack'],
  ['@octokit/rest', 'github-api'],
  ['@octokit/core', 'github-api'],
  ['firebase', 'firebase'],
  ['firebase-admin', 'firebase'],
  ['openai', 'openai'],
  ['@anthropic-ai/sdk', 'anthropic'],
  ['resend', 'resend'],
  ['nodemailer', 'smtp'],
  ['@mailchimp/mailchimp_marketing', 'mailchimp'],
]);

export const FRONTEND_DIRS = ['web_src', 'frontend', 'client', 'ui', 'app/javascript', 'app/frontend', 'web/src'];

export const FRONTEND_FRAMEWORKS = new Set([
  'react', 'vue', 'svelte', 'next', 'nuxt', 'astro', 'remix', '@angular/core',
  'solid-js', 'qwik', 'lit', 'preact',
]);

export const BUNDLERS = new Set(['vite', 'webpack', 'esbuild', 'rollup', 'parcel', 'turbo']);

export const TEST_FRAMEWORKS_JS = new Set([
  'vitest', 'jest', 'mocha', 'jasmine', 'ava', 'tap', 'qunit', 'karma',
  'cypress', 'playwright', '@playwright/test', 'puppeteer',
]);
