import org.apache.spark.launcher.SparkLauncher

object DataPrepLauncher extends App {

  val spark = new SparkLauncher()
    .setSparkHome(Constants.sparkHome)
    .setAppResource(Constants.driverJarPath)
    .setMainClass("DataPrep")
    .setMaster("local[*]")
    .addAppArgs("/Users/doriszhou/Downloads/state_CA-NY.csv")
    .redirectError()
    .startApplication()
  while (!spark.getState.isFinal) {
    Thread.sleep(1000)
  }
}
