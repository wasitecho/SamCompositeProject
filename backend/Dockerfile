# ---------- Stage 1: Build ----------
    FROM eclipse-temurin:17-jdk-jammy AS build
    WORKDIR /app
    
    # Install Maven directly (skip mvnw entirely)
    RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
    
    # Copy project files
    COPY backend/pom.xml ./
    COPY backend/src ./src
    
    # Download dependencies and build the app
    RUN mvn clean package -DskipTests
    
    # ---------- Stage 2: Runtime ----------
    FROM eclipse-temurin:17-jre-jammy
    WORKDIR /app
    
    # Copy the built JAR from the build stage
    COPY --from=build /app/target/*.jar app.jar
    
    # Expose the port used by Spring Boot
    EXPOSE 8080
    ENV PORT=8080
    
    # Start the Spring Boot application
    ENTRYPOINT ["java", "-jar", "app.jar"]
    