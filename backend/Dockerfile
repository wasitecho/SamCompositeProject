# Multi-stage build for smaller final image
# Stage 1: Build
FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy pom.xml and download dependencies (for better caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/target/plastics-demo-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render will set PORT env var, Spring Boot will use it)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

