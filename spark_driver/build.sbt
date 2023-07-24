name := "hmda-spark"

version := "0.1"

scalaVersion := "2.12.15"

libraryDependencies += "org.apache.spark" %% "spark-core" % "3.3.1"
libraryDependencies += "org.apache.spark" %% "spark-sql" % "3.3.1" % "provided"
libraryDependencies += "org.apache.spark" %% "spark-hive-thriftserver" % "3.3.1" % "provided"
