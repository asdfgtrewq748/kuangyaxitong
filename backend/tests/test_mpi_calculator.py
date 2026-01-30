"""
MPI计算引擎单元测试
"""

import pytest
import numpy as np

from app.services.mpi_calculator import (
    calc_mpi,
    calc_mpi_batch,
    calc_roof_stability,
    calc_burst_risk,
    calc_abutment_stress,
    identify_key_layers,
    PointData,
    RockLayer,
    MPIConfig,
)


class TestRockLayer:
    """岩层数据类测试"""

    def test_init(self):
        """测试岩层初始化"""
        layer = RockLayer(
            thickness=10.0,
            name="砂岩",
            density=2600.0,
            elastic_modulus=20.0,
        )
        assert layer.thickness == 10.0
        assert layer.name == "砂岩"

    def test_get_param(self):
        """测试获取参数"""
        layer = RockLayer(
            thickness=10.0,
            density=2600.0,
            elastic_modulus=20.0,
        )
        assert layer.get_param("density", 0) == 2600.0
        assert layer.get_param("nonexistent", 5) == 5.0

    def test_has_parameter(self):
        """测试参数检查"""
        layer = RockLayer(thickness=10.0, density=2600.0)
        assert layer.has_parameter("density") is True
        assert layer.has_parameter("nonexistent") is False


class TestMPIConfig:
    """MPI配置测试"""

    def test_default_weights(self):
        """测试默认权重"""
        config = MPIConfig()
        assert config.weight_roof_stability == 0.4
        assert config.weight_burst_risk == 0.35
        assert config.weight_abutment_stress == 0.25

    def test_validate(self):
        """测试配置验证"""
        config = MPIConfig()
        config.validate()  # 应该不抛出异常

        config.weight_roof_stability = 0.5
        config.weight_burst_risk = 0.3
        config.weight_abutment_stress = 0.2
        config.validate()  # 应该不抛出异常

    def test_validate_invalid(self):
        """测试无效配置"""
        config = MPIConfig()
        config.weight_roof_stability = 0.5
        config.weight_burst_risk = 0.6  # 总和超过1.0
        with pytest.raises(ValueError):
            config.validate()


class TestKeyLayerIdentification:
    """关键层识别测试"""

    def test_no_key_layers(self):
        """测试无关键层"""
        strata = [
            RockLayer(name="泥岩", thickness=3, compressive_strength=20),
            RockLayer(name="泥岩", thickness=4, compressive_strength=25),
        ]
        key_layers = identify_key_layers(strata)
        assert len(key_layers) == 0

    def test_has_key_layer(self):
        """测试有关键层"""
        strata = [
            RockLayer(name="细砂岩", thickness=8, compressive_strength=70, elastic_modulus=30),
            RockLayer(name="泥岩", thickness=3, compressive_strength=20),
        ]
        key_layers = identify_key_layers(strata)
        assert len(key_layers) == 1
        assert key_layers[0] == 0

    def test_multiple_key_layers(self):
        """测试多个关键层"""
        strata = [
            RockLayer(name="细砂岩", thickness=8, compressive_strength=70, elastic_modulus=30),
            RockLayer(name="粗砂岩", thickness=6, compressive_strength=65, elastic_modulus=28),
            RockLayer(name="泥岩", thickness=3, compressive_strength=20),
        ]
        key_layers = identify_key_layers(strata)
        # 细砂岩和粗砂岩都满足条件（强度>60，厚度>5，模量比高）
        assert len(key_layers) >= 1


class TestRSI:
    """顶板稳定性指标测试"""

    def test_no_strata(self):
        """测试无岩层数据"""
        point = PointData(x=0, y=0, strata=None)
        rsi = calc_roof_stability(point)
        assert rsi == 50.0

    def test_good_roof(self):
        """测试顶板条件好"""
        point = PointData(
            x=0, y=0,
            strata=[
                RockLayer(name="细砂岩", thickness=10, tensile_strength=5.0, compressive_strength=70, elastic_modulus=25),
                RockLayer(name="细砂岩", thickness=8, tensile_strength=4.5, compressive_strength=65, elastic_modulus=22),
            ]
        )
        rsi = calc_roof_stability(point)
        assert 0 <= rsi <= 100
        # 高抗拉强度应该得到较高分数
        assert rsi > 50

    def test_poor_roof(self):
        """测试顶板条件差"""
        point = PointData(
            x=0, y=0,
            strata=[
                RockLayer(name="泥岩", thickness=2, tensile_strength=1.0, compressive_strength=15, elastic_modulus=5),
                RockLayer(name="泥岩", thickness=3, tensile_strength=0.8, compressive_strength=12, elastic_modulus=4),
            ]
        )
        rsi = calc_roof_stability(point)
        assert 0 <= rsi <= 100
        # 低抗拉强度、软岩应该得到较低分数
        assert rsi < 50


class TestBRI:
    """冲击地压风险指标测试"""

    def test_shallow_depth(self):
        """测试浅埋深"""
        point = PointData(
            x=0, y=0, burial_depth=200, thickness=3.0,
            strata=[RockLayer(name="砂岩", thickness=10, compressive_strength=50, elastic_modulus=20)]
        )
        bri = calc_burst_risk(point)
        assert 0 <= bri <= 100
        # 浅埋深风险较低，分数应该较高
        assert bri > 80

    def test_deep_depth(self):
        """测试深埋深"""
        point = PointData(
            x=0, y=0, burial_depth=600, thickness=5.0,
            strata=[
                RockLayer(name="细砂岩", thickness=15, compressive_strength=70, elastic_modulus=30),
                RockLayer(name="砾岩", thickness=20, compressive_strength=80, elastic_modulus=35),
            ]
        )
        bri = calc_burst_risk(point)
        assert 0 <= bri <= 100
        # 深埋厚硬岩层，风险高，分数应该较低
        assert bri < 70


class TestASI:
    """支承压力分布指标测试"""

    def test_no_strata(self):
        """测试无岩层数据"""
        point = PointData(x=0, y=0, strata=None)
        asi = calc_abutment_stress(point)
        assert asi == 50.0

    def test_stiff_roof(self):
        """测试高刚度顶板"""
        point = PointData(
            x=0, y=0,
            strata=[
                RockLayer(name="细砂岩", thickness=10, elastic_modulus=30, friction_angle=35),
                RockLayer(name="细砂岩", thickness=10, elastic_modulus=28, friction_angle=34),
            ]
        )
        asi = calc_abutment_stress(point)
        assert 0 <= asi <= 100

    def test_soft_roof(self):
        """测试低刚度顶板"""
        point = PointData(
            x=0, y=0,
            strata=[
                RockLayer(name="泥岩", thickness=5, elastic_modulus=5, friction_angle=25),
                RockLayer(name="泥岩", thickness=5, elastic_modulus=6, friction_angle=26),
            ]
        )
        asi = calc_abutment_stress(point)
        assert 0 <= asi <= 100


class TestMPI:
    """综合MPI测试"""

    def test_basic_calculation(self):
        """测试基本计算"""
        point = PointData(
            x=100, y=200, thickness=3.5, burial_depth=350,
            strata=[
                RockLayer(name="细砂岩", thickness=8.5, tensile_strength=3.5, compressive_strength=55, elastic_modulus=18),
                RockLayer(name="中砂岩", thickness=12.0, tensile_strength=3.0, compressive_strength=48, elastic_modulus=15),
            ]
        )
        result = calc_mpi(point)

        assert "mpi" in result
        assert "breakdown" in result
        assert 0 <= result["mpi"] <= 100
        assert "rsi" in result["breakdown"]
        assert "bri" in result["breakdown"]
        assert "asi" in result["breakdown"]

    def test_custom_weights(self):
        """测试自定义权重"""
        point = PointData(
            x=0, y=0, thickness=3.0,
            strata=[RockLayer(name="砂岩", thickness=10, elastic_modulus=20)]
        )

        result1 = calc_mpi(point)
        result2 = calc_mpi(point, weights={
            "roof_stability": 0.5,
            "burst_risk": 0.3,
            "abutment_stress": 0.2
        })

        # 权重不同，结果应该不同
        assert abs(result1["mpi"] - result2["mpi"]) > 0.01


class TestBatchCalculation:
    """批量计算测试"""

    def test_batch_calculation(self):
        """测试批量计算"""
        points_data = {
            "point1": {
                "x": 0, "y": 0, "thickness": 3.0, "burial_depth": 300,
                "strata": [
                    {"name": "砂岩", "thickness": 10, "elastic_modulus": 20}
                ]
            },
            "point2": {
                "x": 100, "y": 100, "thickness": 5.0, "burial_depth": 400,
                "strata": [
                    {"name": "泥岩", "thickness": 5, "elastic_modulus": 8}
                ]
            },
        }

        results = calc_mpi_batch(points_data)

        assert len(results) == 2
        assert "point1" in results
        assert "point2" in results
        assert "mpi" in results["point1"]
        assert "mpi" in results["point2"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
