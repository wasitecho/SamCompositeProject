# ---------- Stage 1: Build ----------
    FROM eclipse-temurin:17-jdk-jammy AS build
    WORKDIR /app
    
    # Copy Maven wrapper and config (adjusted paths)
    COPY backend/.mvn/ .mvn
    COPY backend/pom.xml backend/mvnw ./
    RUN chmod +x mvnw && chmod +x .mvn/wrapper/maven-wrapper.jar || true
    
    # Install curl and download mvnw if missing
    RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* && \
        if [ ! -f "./mvnw" ]; then curl -sSL https://raw.githubusercontent.com/apache/maven-wrapper/main/mvnw -o mvnw && chmod +x mvnw; fi
    
    # Download dependencies (cached)
    RUN ./mvnw dependency:go-offline -B
    
    # Copy backend source code
    COPY backend/src ./src
    
    # Build the Spring Boot app
    RUN ./mvnw clean package -DskipTests
    
    # ---------- Stage 2: Runtime ----------
    FROM eclipse-temurin:17-jre-jammy
    WORKDIR /app
    
    # Copy built jar from build stage
    COPY --from=build /app/target/plastics-demo-backend-0.0.1-SNAPSHOT.jar app.jar
    
    EXPOSE 8080
    ENV PORT=8080
    ENTRYPOINT ["java", "-jar", "app.jar"]
    