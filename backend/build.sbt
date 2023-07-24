name := "hmda-backend"

version := "0.1"

scalaVersion := "2.12.15"

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-core" % "3.3.1",
  "org.apache.hive" % "hive-jdbc" % "3.1.3",
  "com.lihaoyi" %% "cask" % "0.9.1",
  "org.jooq" %% "jooq-scala" % "3.12.4",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "com.lihaoyi" %% "ujson" % "3.0.0"
)