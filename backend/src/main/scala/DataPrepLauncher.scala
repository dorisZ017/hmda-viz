import org.apache.spark.launcher.SparkLauncher

object DataPrepLauncher extends App {

  val spark = new SparkLauncher()
    .setSparkHome(Constants.sparkHome)
    .setAppResource(Constants.driverJarPath)
    .setMainClass("DataPrep")
    .setMaster("spark://Dongyings-MBP:7077")
    .addAppArgs("/Users/doriszhou/Downloads/all_state.csv")
    .redirectError()
    .startApplication()
  while (!spark.getState.isFinal) {
    Thread.sleep(1000)
  }
}
