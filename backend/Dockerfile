# Dockerfile for FastAPI
# https://hub.docker.com/_/python/tags
ARG BUILD_VERSION=3.12

########################################
# --- Base ---
########################################
FROM python:${BUILD_VERSION}-alpine AS base

# Set working directory
WORKDIR /app

########################################
# --- Builder Stage ---
########################################
FROM base AS builder

ARG POETRY_VERSION=1.7.1

# Set environment variables
ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    # PIP config
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # Poetry config
    POETRY_VERSION=${POETRY_VERSION}

# Copy project and poetry files
COPY /. /app/

# install system dependencies, update pip, install poetry, its packages, and cleanup
RUN apk update && \
    apk add --no-cache --virtual .build-deps build-base && \
    pip install --upgrade pip "poetry==$POETRY_VERSION" && \
    poetry config virtualenvs.create false && \
    poetry install --only main && \
    apk del .build-deps

########################################
# --- Runtime Stage ---
########################################
FROM base AS runtime

ARG PYTHON_VERSION=3.12
ARG PORT=8000
ARG ENV_MODE=prod
ARG HOST=0.0.0.0


ENV PACKAGE_DIR=/usr/local/lib/python${PYTHON_VERSION}/site-packages \
    PORT=${PORT} \
    ENV_MODE=${ENV_MODE} \
    HOST=${HOST}

# Copy files from builder
# COPY .env.backend .env.backend
COPY --from=builder /app /app/
COPY --from=builder $PACKAGE_DIR $PACKAGE_DIR

# Expose port
EXPOSE $PORT

# Run server
# CMD ["sleep", "infinity"]
CMD python -m app.start --env $ENV_MODE --host $HOST --port $PORT
