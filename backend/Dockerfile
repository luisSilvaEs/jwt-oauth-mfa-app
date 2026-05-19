# =============================================================================
# Dockerfile — Spring Boot Backend
# Multi-stage build: compile with Maven, then run with a slim JRE image.
# =============================================================================

# ---- Stage 1: Build ----
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and pom first (layer cache — only re-downloads deps if pom changes)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build the jar, skipping tests (they need a live DB)
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# ---- Stage 2: Run ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy only the compiled jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]