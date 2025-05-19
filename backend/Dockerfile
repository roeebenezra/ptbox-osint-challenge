FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl sqlite3 \
    git \
    nmap \
    dnsutils \
    curl \
    build-essential \
    libffi-dev \
    libssl-dev \
    libxml2-dev \
    libxslt1-dev \
    zlib1g-dev \
    python3-dev \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Install Amass from source (ARM compatible)
RUN apt-get update && apt-get install -y golang git && \
    git clone https://github.com/owasp-amass/amass.git && \
    cd amass && \
    go install ./... && \
    cp /root/go/bin/amass /usr/local/bin/amass && \
    chmod +x /usr/local/bin/amass && \
    cd .. && rm -rf amass


# Install theHarvester
RUN git clone https://github.com/laramies/theHarvester.git && \
    cd theHarvester && \
    pip install . && \
    mv theHarvester /opt/theHarvester


# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY ./app ./app

# Set entry point
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
