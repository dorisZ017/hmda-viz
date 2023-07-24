ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.12.15"

lazy val root = (project in file("."))
  .settings(
    name := "hmda-viz"
  )

lazy val backend = project in file("./backend")
lazy val sparkDriver = (project in file("./spark_driver")).dependsOn(backend)

