<?php
/**
 * user transaction like input and output to database
 */
class Usertrans
{

    private $mconn;
    
    function __construct()
    {
        require_once('db_connect.php');
        $conn = new Dbconnect;
        $this->mconn = $conn->establish_conn();
            
    }

    public function getFloorById($id){

        $sql = "SELECT * FROM `floors` WHERE `floorid` = :id";
        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        try {
            if ($bind->execute()) {
                $user = $bind->fetch(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $user;
    }

    public function createFloor($id, $name){

        $sql = "INSERT INTO `floors`(`id`, `floorid`, `name`) VALUES (null, :id, :name)";

        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":name", $name);
        
        try {
            
            if ($bind->execute()) {
                return true;
            } else{
                return false;
            }

        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function insertFloorDetails($id, $type, $xcord, $ycord, $name){

        $node = $this->extractPathnodeId($id, $xcord, $ycord)['id'];

        $sql = "INSERT INTO `floordetails`(`id`, `floorid`, `type`, `name`, `pathslot`) VALUES (null, :id, :type, :name, :slot)";

        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":type", $type);
        $bind->bindParam(":name", $name);
        $bind->bindParam(":slot", $node);
        
        try {
            
            if ($bind->execute()) {
                return true;
            } else{
                return false;
            }

        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function extractFloorDetails($id){

        $sql = "SELECT * FROM `floordetails` WHERE `floorid` = :id";
        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);

        try {
            if ($bind->execute()) {
                $user = $bind->fetchAll(PDO::FETCH_ASSOC);
                $data_array = array();
                foreach ($user as $key) {
                    $node1 = $this->extractPathNodeById($id, $key['pathslot']);
                    $xcord = $node1['xcord'];
                    $ycord = $node1['ycord'];
                    
                    $temp_array = array('xcord'=>$xcord, 'ycord'=>$ycord, 'name'=>$key['name'], 'type'=>$key['type']);
                    array_push($data_array, $temp_array);
                }
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $data_array;
    }

    public function insertPathDetails($id, $xcord, $ycord, $xcordf, $ycordf){

        $node1 = $this->extractPathnodeId($id, $xcord, $ycord)['id'];
        $node2 = $this->extractPathnodeId($id, $xcordf, $ycordf)['id'];

        if($node1 == $node2){
            return;
        }

        $sql = "INSERT INTO `pathdetails`(`id`, `floorid`, `fromnode`, `tonode`) VALUES (null, :id, :node1, :node2)";

        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":node1", $node1);
        $bind->bindParam(":node2", $node2);
        
        try {
            
            if ($bind->execute()) {
                return true;
            } else{
                return false;
            }

        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function extractPathDetails($id){

        $sql = "SELECT * FROM `pathdetails` WHERE `floorid` = :id";
        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);

        try {
            if ($bind->execute()) {
                $user = $bind->fetchAll(PDO::FETCH_ASSOC);
                $data_array = array();
                foreach ($user as $key) {
                    $node1 = $this->extractPathNodeById($id, $key['fromnode']);
                    $node2 = $this->extractPathNodeById($id, $key['tonode']);
                    $xcord = $node1['xcord'];
                    $ycord = $node1['ycord'];
                    $xcordf = $node2['xcord'];
                    $ycordf = $node2['ycord'];
                    $temp_array = array('xcord'=>$xcord, 'ycord'=>$ycord, 'xcordf'=>$xcordf, 'ycordf'=>$ycordf);
                    array_push($data_array, $temp_array);
                }
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $data_array;
    }
    
    public function insertPathNodeDetails($id, $xcord, $ycord){

        $sql = "INSERT INTO `pathslots`(`id`, `floorid`, `xcord`, `ycord`) VALUES (null, :id, :xcord, :ycord)";

        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":xcord", $xcord);
        $bind->bindParam(":ycord", $ycord);
        
        try {
            
            if ($bind->execute()) {
                return true;
            } else{
                return false;
            }

        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function extractPathNodeDetails($id){

        $sql = "SELECT * FROM `pathslots` WHERE `floorid` = :id";
        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);

        try {
            if ($bind->execute()) {
                $user = $bind->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $user;
    }

    public function extractPathnodeId($id, $xcord, $ycord){
        $sql = "SELECT * FROM `pathslots` WHERE `floorid` = :id AND `xcord` = :xcord AND `ycord` = :ycord";
        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":xcord", $xcord);
        $bind->bindParam(":ycord", $ycord);

        try {
            if ($bind->execute()) {
                $user = $bind->fetch(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $user;
    }

    public function extractPathNodeById($fid, $id){
        $sql = "SELECT * FROM `pathslots` WHERE `floorid` = :fid AND `id` = :id";
        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":fid", $fid);

        try {
            if ($bind->execute()) {
                $user = $bind->fetch(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $user;
    }

    public function insertQrItemDetails($id, $xcord, $ycord, $value){

        $node = $this->extractPathnodeId($id, $xcord, $ycord)['id'];

        $sql = "INSERT INTO `qrcodedetails`(`id`, `floorid`, `qrslot`, `value`) VALUES (null, :id, :node, :value)";

        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":node", $node);
        $bind->bindParam(":value", $value);
        
        try {
            
            if ($bind->execute()) {
                return true;
            } else{
                return false;
            }

        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function extractQrItemDetails($id, $xcord, $ycord){

        $node = $this->extractPathnodeId($id, $xcord, $ycord)['id'];

        $sql = "SELECT * FROM `qrcodedetails` WHERE `floorid` = :id AND `qrslot` = :slot";

        $bind = $this->mconn->prepare($sql);
        $bind->bindParam(":id", $id);
        $bind->bindParam(":slot", $node);

        try {
            if ($bind->execute()) {
                $user = $bind->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        return $user;
    }
}

?>