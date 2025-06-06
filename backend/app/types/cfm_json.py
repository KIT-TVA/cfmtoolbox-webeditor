from dataclasses import dataclass


@dataclass
class Interval:
    """Dataclass representing a cardinality interval."""

    lower: int
    """Lower bound of the interval."""

    upper: int | None
    """Upper bound of the interval. None if unbounded."""

    def __str__(self) -> str:
        lower_formatted = self.lower
        upper_formatted = "*" if self.upper is None else self.upper
        return f"{lower_formatted}..{upper_formatted}"


@dataclass
class Cardinality:
    """Dataclass representing a cardinality."""

    intervals: list[Interval]
    """Ordered list of cardinality intervals."""

    def __str__(self) -> str:
        return ", ".join(map(str, self.intervals))

    def is_valid_cardinality(self, value: int) -> bool:
        """Check if a value is a valid cardinality for the given intervals."""

        for interval in self.intervals:
            if (interval.lower <= value) and (interval.upper is None or interval.upper >= value):
                return True
        return False


@dataclass
class Feature:
    """Dataclass representing a feature in a feature model."""

    name: str
    """Globally unique name of the feature."""

    instance_cardinality: Cardinality
    """Instance cardinality of the feature"""

    group_type_cardinality: Cardinality
    """Group type cardinality of the feature."""

    group_instance_cardinality: Cardinality
    """Group instance cardinality of the feature."""

    children: list["Feature"]
    """List of child features."""

    def __str__(self) -> str:
        return self.name

    @property
    def is_required(self) -> bool:
        """Check if the feature is required."""

        return self.instance_cardinality.intervals[0].lower != 0

    @property
    def is_unbound(self) -> bool:
        """Check if the feature is unbound."""

        return self.instance_cardinality.intervals[-1].upper is None or any(
            child.is_unbound for child in self.children
        )


@dataclass
class Constraint:
    """Dataclass representing a constraint in a feature model."""

    require: bool
    """Indicates whether the constraint is a require or exclude constraint."""

    first_feature_name: str
    """First feature in the constraint."""

    first_cardinality: Cardinality
    """Cardinality of the first feature."""

    second_feature_name: str
    """Second feature in the constraint."""

    second_cardinality: Cardinality
    """Cardinality of the second feature."""

    def __str__(self) -> str:
        return f"{self.first_feature_name} => {self.second_feature_name}"


@dataclass
class CFMJson:
    root: Feature
    """Root feature of the feature model."""

    constraints: list[Constraint]
    """List of constraints in the feature model."""

    @property
    def features(self) -> list[Feature]:
        """Dynamically computed list of all features in the feature model."""

        features = [self.root]

        for feature in features:
            features.extend(feature.children)

        return features

    @property
    def is_unbound(self) -> bool:
        """Check if the feature model is unbound."""

        return self.root.is_unbound
